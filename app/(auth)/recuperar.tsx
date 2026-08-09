import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth } from "../config/firebaseConfig";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const router = useRouter();

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setIsSuccess(false);
      setModalTitle("Verifica tus datos");
      setModalMessage("Por favor, ingresa tu correo electrónico.");
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setIsSuccess(true);
      setModalTitle("Correo enviado");
      setModalMessage(
        "Revisa tu bandeja de entrada o spam para restablecer tu contraseña."
      );
      setShowModal(true);

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
        setModalTitle("Ocurrió un problema");
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        {/* Fondo de degradado fluido pastel Regood */}
        <LinearGradient
          colors={["#E0F7F1", "#E8FAEE", "#FFF0E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Orbes de luz decorativos */}
        <View style={[styles.glowOrb, styles.orbTopLeft]} />
        <View style={[styles.glowOrb, styles.orbBottomRight]} />

        <SafeAreaView style={{ flex: 1 }}>
          {/* Botón de regreso flotante */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#059669" />
          </TouchableOpacity>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {/* Header / Brand */}
              <View style={styles.header}>
                <View style={styles.logoBadgeShadow}>
                  <Image
                    source={require("../../assets/images/logosinfondo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>
                  Te enviaremos las instrucciones a tu correo
                </Text>
              </View>

              {/* Glassmorphism Card */}
              <View style={styles.glassCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      isEmailFocused && styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="mail"
                      size={18}
                      color={isEmailFocused ? "#10B981" : "#F59E0B"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="ejemplo@correo.com"
                      placeholderTextColor="#A0AEC0"
                      onChangeText={setEmail}
                      value={email}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                    />
                  </View>
                </View>

                {/* Botón Principal Regood */}
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={handleResetPassword}
                  disabled={loading}
                  style={[styles.btnShadow, loading && styles.buttonDisabled]}
                >
                  <LinearGradient
                    colors={["#059669", "#10B981", "#F59E0B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.mainBtn}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.btnText}>ENVIAR CORREO</Text>
                        <View style={styles.arrowCircle}>
                          <Ionicons
                            name="paper-plane"
                            size={15}
                            color="#059669"
                          />
                        </View>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Enlace para volver */}
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Text style={styles.registerText}>
                  ¿Recordaste tu contraseña?{" "}
                  <Text style={styles.registerHighlight}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Modal Feedback Regood */}
          <Modal
            visible={showModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Ionicons
                  name={isSuccess ? "mail-open" : "alert-circle"}
                  size={42}
                  color={isSuccess ? "#10B981" : "#F59E0B"}
                  style={{ marginBottom: 12 }}
                />
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <Text style={styles.modalMessage}>{modalMessage}</Text>

                {!isSuccess && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.modalButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Entendido</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#E0F7F1",
  },
  glowOrb: {
    position: "absolute",
    borderRadius: 150,
    opacity: 0.35,
  },
  orbTopLeft: {
    width: 260,
    height: 260,
    top: -50,
    left: -50,
    backgroundColor: "#10B981",
  },
  orbBottomRight: {
    width: 280,
    height: 280,
    bottom: -60,
    right: -50,
    backgroundColor: "#F59E0B",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadgeShadow: {
    width: 110,
    height: 110,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "700",
    textAlign: "center",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#374151",
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: "#10B981",
    shadowColor: "#10B981",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },
  btnShadow: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  mainBtn: {
    flexDirection: "row",
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
    marginRight: 10,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  registerBtn: {
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  registerHighlight: {
    color: "#059669",
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    width: "85%",
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
});