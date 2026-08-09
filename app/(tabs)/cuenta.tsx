import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth, db } from "../config/firebaseConfig";

type UserData = {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
};

export default function CuentaScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado para controlar la visibilidad del Modal de éxito personalizado
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState<UserData>({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

  // Cargar datos del usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setFormData({
              nombres: data.nombres || "",
              apellidos: data.apellidos || "",
              correo: user.email || data.correo || "",
              telefono: data.telefono || "",
              direccion: data.direccion || "",
            });
          } else {
            setFormData((prev) => ({
              ...prev,
              correo: user.email || "",
            }));
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  // Guardar cambios en Firestore
  const guardarDatos = async () => {
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
      await setDoc(
        userDocRef,
        {
          nombres: formData.nombres.trim(),
          apellidos: formData.apellidos.trim(),
          correo: formData.correo.trim(),
          telefono: formData.telefono.trim(),
          direccion: formData.direccion.trim(),
          nombre: `${formData.nombres} ${formData.apellidos}`.trim(),
        },
        { merge: true }
      );

      setIsEditing(false);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al guardar datos:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

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
        {/* Header Superior */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.replace("/(tabs)/home" as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={20} color="#059669" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mis Datos Personales</Text>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push("/configuracionapp" as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={20} color="#059669" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar y Datos Principales */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={44} color="#10B981" />
              </View>
            </View>
            <Text style={styles.userName}>
              {`${formData.nombres} ${formData.apellidos}`.trim() || "Usuario Regood"}
            </Text>
            <Text style={styles.userEmail}>{formData.correo}</Text>
          </View>

          {/* Formulario Estilizado */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Información Personal</Text>
              <TouchableOpacity
                onPress={() => {
                  if (isEditing) {
                    guardarDatos();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={saving}
                activeOpacity={0.7}
                style={styles.editBadge}
              >
                <Text style={styles.editActionText}>
                  {saving ? "Guardando..." : isEditing ? "Guardar" : "Editar"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nombres */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombres</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.nombres}
                editable={isEditing}
                onChangeText={(text) =>
                  setFormData({ ...formData, nombres: text })
                }
                placeholder="Ingresa tus nombres"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Apellidos */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellidos</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.apellidos}
                editable={isEditing}
                onChangeText={(text) =>
                  setFormData({ ...formData, apellidos: text })
                }
                placeholder="Ingresa tus apellidos"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Correo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.correo}
                editable={false}
                keyboardType="email-address"
              />
            </View>

            {/* Teléfono */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono / Celular</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.telefono}
                editable={isEditing}
                onChangeText={(text) =>
                  setFormData({ ...formData, telefono: text })
                }
                placeholder="Ej: +51 987 654 321"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Dirección */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección de Residencia</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.direccion}
                editable={isEditing}
                onChangeText={(text) =>
                  setFormData({ ...formData, direccion: text })
                }
                placeholder="Ej: Av. Principal 123"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Navegación rápida inferior */}
          <View style={styles.quickNavContainer}>
            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => router.push("/publicaciones" as any)}
              activeOpacity={0.8}
            >
              <View style={styles.quickNavIconWrapper}>
                <Ionicons name="pricetag-outline" size={18} color="#059669" />
              </View>
              <Text style={styles.quickNavText}>Mis Publicaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => router.push("/favoritos" as any)}
              activeOpacity={0.8}
            >
              <View style={styles.quickNavIconWrapper}>
                <Ionicons name="heart-outline" size={18} color="#059669" />
              </View>
              <Text style={styles.quickNavText}>Favoritos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal Personalizado de Éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.modalIconCircle}>
                  <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                </View>
                <Text style={styles.modalTitle}>¡Actualización Exitosa!</Text>
                <Text style={styles.modalMessage}>
                  Tus datos personales se han guardado correctamente.
                </Text>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#059669", "#10B981"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.modalButtonText}>Aceptar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#E0F7F1",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 15,
  },
  headerIconBtn: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8FAEE",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 10,
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "700",
    marginTop: 2,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  editBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  editActionText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#059669",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(16, 185, 129, 0.3)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    backgroundColor: "#FFFFFF",
  },
  disabledInput: {
    borderColor: "rgba(229, 231, 235, 0.8)",
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },
  quickNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  quickNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    width: "48%",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickNavIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickNavText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1F2937",
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 6,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
    fontWeight: "500",
  },
  modalButton: {
    width: "100%",
  },
  modalButtonGradient: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});