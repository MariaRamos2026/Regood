import { Ionicons } from "@expo/vector-icons";
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
      // Muestra el modal personalizado de éxito
      setModalVisible(true);
    } catch (error) {
      console.error("Error al guardar datos:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#003e36" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e4fdf7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.replace("/(tabs)/home" as any)}
        >
          <Ionicons name="home-outline" size={24} color="#003e36" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mi Cuenta - Mis Datos</Text>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push("/configuracionapp" as any)}
        >
          <Ionicons name="settings-outline" size={24} color="#003e36" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#003e36" />
          </View>
          <Text style={styles.userName}>
            {`${formData.nombres} ${formData.apellidos}`.trim() || "Usuario"}
          </Text>
          <Text style={styles.userEmail}>{formData.correo}</Text>
        </View>

        {/* Formulario */}
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
              placeholderTextColor="#aaa"
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
              placeholderTextColor="#aaa"
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
              placeholderTextColor="#aaa"
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
              placeholderTextColor="#aaa"
            />
          </View>
        </View>

        {/* Navegación rápida */}
        <View style={styles.quickNavContainer}>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.push("/publicaciones" as any)}
          >
            <Ionicons name="pricetag-outline" size={20} color="#003e36" />
            <Text style={styles.quickNavText}>Mis Publicaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.push("/favoritos" as any)}
          >
            <Ionicons name="heart-outline" size={20} color="#003e36" />
            <Text style={styles.quickNavText}>Favoritos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Bonito de Éxito Personalizado */}
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
                <View style={styles.modalIconContainer}>
                  <Ionicons name="checkmark-circle" size={54} color="#2ecc71" />
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
                  <Text style={styles.modalButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e4fdf7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerIconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003e36",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003e36",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003e36",
  },
  editActionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#003e36",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#003e36",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  disabledInput: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    color: "#555",
  },
  quickNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  quickNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    width: "48%",
    elevation: 1,
  },
  quickNavText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#003e36",
    marginLeft: 8,
  },

  /* Estilos para el Modal de éxito personalizado */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modalIconContainer: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#003e36",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#003e36",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});