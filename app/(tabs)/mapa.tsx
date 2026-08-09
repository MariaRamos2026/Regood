import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { auth, db } from "../config/firebaseConfig";

const LIMA_POR_DEFECTO = { latitude: -12.0464, longitude: -77.0428 };

const ERRORES = {
  PERMISO_DENEGADO: "Activá los permisos de ubicación para continuar.",
  GPS_DESACTIVADO:
    "El GPS está desactivado. Activalo para compartir tu ubicación exacta.",
  POSICION_NO_DISPONIBLE:
    "No se pudo obtener la ubicación. Verificá que el GPS esté encendido.",
  SIN_CHAT: "Falta información del chat para poder enviar la ubicación.",
};

export default function MapaScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  // Obtener y normalizar de forma segura el chatId y el usuarioActualId
  const chatId = Array.isArray(searchParams.chatId)
    ? searchParams.chatId[0]
    : searchParams.chatId;

  const paramUsuarioId = Array.isArray(searchParams.usuarioActualId)
    ? searchParams.usuarioActualId[0]
    : searchParams.usuarioActualId;

  const usuarioActualId = paramUsuarioId || auth.currentUser?.uid;

  const [location, setLocation] = useState(LIMA_POR_DEFECTO);
  const [address, setAddress] = useState(
    "Tocá el mapa o compartí tu ubicación actual"
  );
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // ---------- Ubicación Segura ----------

  const solicitarPermisoUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error(ERRORES.PERMISO_DENEGADO);
    }
    const serviciosActivos = await Location.hasServicesEnabledAsync();
    if (!serviciosActivos) {
      throw new Error(ERRORES.GPS_DESACTIVADO);
    }
  };

  const obtenerUbicacionExacta = async () => {
    await solicitarPermisoUbicacion();
    try {
      // Uso de Accuracy.Balanced/High directo para evitar cierres nativos por timeout forzado
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return posicion.coords;
    } catch (error: any) {
      console.error("Error obteniendo posicion:", error);
      throw new Error(ERRORES.POSICION_NO_DISPONIBLE);
    }
  };

  const obtenerDireccionLegible = async (coords: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const [lugar] = await Location.reverseGeocodeAsync(coords);
      if (!lugar) return null;
      const partes = [lugar.name, lugar.city, lugar.region].filter(Boolean);
      return partes.length ? partes.join(", ") : null;
    } catch {
      return null;
    }
  };

  // ---------- Envío a Firestore ----------

  const enviarMensajeUbicacion = async (
    coords: { latitude: number; longitude: number },
    precisionMetros: number | null,
    direccion: string | null
  ) => {
    const { latitude, longitude } = coords;

    const latitudValida =
      typeof latitude === "number" && latitude >= -90 && latitude <= 90;
    const longitudValida =
      typeof longitude === "number" && longitude >= -180 && longitude <= 180;
    if (!latitudValida || !longitudValida) {
      throw new Error(
        "Coordenadas inválidas: no se puede enviar la ubicación."
      );
    }

    const textoUbicacion = `📍 Ubicación compartida: ${direccion || `${latitude}, ${longitude}`}`;
    const userEmail = auth.currentUser?.email || "Anónimo";
    const userId = auth.currentUser?.uid;

    await addDoc(collection(db, "mensajes"), {
      producto: String(chatId),
      texto: textoUbicacion,
      usuario: userEmail,
      fecha: serverTimestamp(),
      type: "venta",
      ubicacion: {
        latitude,
        longitude,
        accuracy: precisionMetros,
        direccion: direccion ?? null,
      },
    });

    if (userId && chatId) {
      const conversacionRef = doc(db, "conversaciones", String(chatId));
      await setDoc(
        conversacionRef,
        {
          producto: String(chatId),
          ultimoMensaje: textoUbicacion,
          userId: userId,
          fecha: serverTimestamp(),
        },
        { merge: true }
      );
    }
  };

  const confirmarYEnviarUbicacion = useCallback(
    async (
      coords: { latitude: number; longitude: number },
      precisionMetros: number | null = null
    ) => {
      if (!chatId || !usuarioActualId) {
        Alert.alert("Error", ERRORES.SIN_CHAT);
        return;
      }

      setEnviando(true);
      try {
        const direccion = await obtenerDireccionLegible(coords);
        if (direccion) setAddress(direccion);

        await enviarMensajeUbicacion(coords, precisionMetros, direccion);

        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          router.back();
        }, 1800);
      } catch (error: any) {
        Alert.alert(
          "No se pudo compartir la ubicación",
          error.message ?? "Error desconocido."
        );
      } finally {
        setEnviando(false);
      }
    },
    [chatId, usuarioActualId, router]
  );

  const handleCompartirActual = useCallback(async () => {
    try {
      const coords = await obtenerUbicacionExacta();
      setLocation(coords);
      await confirmarYEnviarUbicacion(coords, coords.accuracy ?? null);
    } catch (error: any) {
      Alert.alert(
        "No se pudo obtener tu ubicación",
        error.message ?? "Error desconocido."
      );
    }
  }, [confirmarYEnviarUbicacion]);

  const handleMapPress = useCallback(
    async (event: MapPressEvent) => {
      const coords = event.nativeEvent.coordinate;
      setLocation(coords);
      await confirmarYEnviarUbicacion(coords, null);
    },
    [confirmarYEnviarUbicacion]
  );

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#E0F7F1", "#E8FAEE", "#FFF0E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.glowOrb, styles.orbTopLeft]} />
      <View style={[styles.glowOrb, styles.orbBottomRight]} />

      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#059669" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Punto de Encuentro</Text>
            <Text style={styles.subtitle}>
              Tocá el mapa para elegir un lugar o compartí tu ubicación actual
            </Text>
          </View>

          <View style={styles.glassCard}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
              >
                <Marker
                  coordinate={location}
                  title="Punto de encuentro"
                  pinColor="#10B981"
                />
              </MapView>

              {enviando && (
                <View style={styles.overlayCargando}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.cargandoText}>
                    Enviando ubicación...
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="location-sharp"
                size={18}
                color="#059669"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.address} numberOfLines={2}>
                {address}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleCompartirActual}
              disabled={enviando}
              style={[styles.btnShadow, enviando && styles.buttonDisabled]}
            >
              <LinearGradient
                colors={["#059669", "#10B981", "#F59E0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.mainBtn}
              >
                {enviando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="navigate"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.btnText}>COMPARTIR MI UBICACIÓN</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <Modal transparent visible={showModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Ionicons
                name="checkmark-circle"
                size={54}
                color="#10B981"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.modalTitle}>Ubicación compartida</Text>
              <Text style={styles.modalMessage}>
                Tu punto de encuentro fue enviado al chat correctamente.
              </Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 15,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    height: 320,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  map: {
    flex: 1,
  },
  overlayCargando: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cargandoText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 8,
    fontSize: 14,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
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
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
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
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
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
    lineHeight: 20,
  },
});