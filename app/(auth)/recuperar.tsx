import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebaseConfig"; // Ajusta la ruta a tu config de Firebase

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const router = useRouter();

  const handleResetPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setIsSuccess(false);
      setModalTitle("Atención");
      setModalMessage("Por favor, ingresa tu correo electrónico.");
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setIsSuccess(true);
      setModalTitle("📩 Correo enviado");
      setModalMessage(
        "Revisa tu bandeja de entrada o spam para restablecer tu contraseña."
      );
      setShowModal(true);

      // Redirigir de regreso tras 2.5 segundos
      setTimeout(() => {
        setShowModal(false);
        router.back();
      }, 2500);
    } catch (error: any) {
      setIsSuccess(false);
      if (error.code === "auth/user-not-found") {
        setModalTitle("Usuario no encontrado");
        setModalMessage("No existe una cuenta registrada con este correo.");
      } else if (error.code === "auth/invalid-email") {
        setModalTitle("Correo inválido");
        setModalMessage("Ingresa una dirección de correo electrónico válida.");
      } else {
        setModalTitle("Error");
        setModalMessage(
          "No se pudo enviar el correo de recuperación. Inténtalo más tarde."
        );
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#04373b" />
      </TouchableOpacity>

      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo para recibir el enlace
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>

      {/* Modal dinámico */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons
              name={isSuccess ? "mail-open-outline" : "alert-circle-outline"}
              size={48}
              color={isSuccess ? "#04373b" : "#e74c3c"}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>

            {!isSuccess && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Entendido</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d9faf1",
    padding: 25,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#04373b",
  },
  subtitle: {
    fontSize: 15,
    color: "#04373b",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "85%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#a5726a",
    padding: 14,
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#04373b",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#04373b",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});