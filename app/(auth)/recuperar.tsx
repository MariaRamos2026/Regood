import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleResetPassword = () => {
    if (!email) {
      setShowModal(true);
      return;
    }
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      router.back();
       }, 2500);
  };
    return (
    <View style={styles.container}>
      {/* 🔹 Botón de regreso */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#04373b" />
      </TouchableOpacity>

      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tu correo para recibir el enlace</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      {/* 🔹 Modal bonito */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📩 Mensaje enviado</Text>
            <Text style={styles.modalText}>
              Revisa tu bandeja de entrada para restablecer tu contraseña.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#d9faf1", padding: 25 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#04373b" },
  subtitle: { fontSize: 15, color: "#04373b", marginBottom: 20 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#a5726a", padding: 12, borderRadius: 8, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalBox: { backgroundColor: "#fff", padding: 25, borderRadius: 12, width: "80%", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#04373b", marginBottom: 10 },
  modalText: { fontSize: 15, color: "#333", textAlign: "center" },
});