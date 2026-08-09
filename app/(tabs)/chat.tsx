import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { auth, db } from "./../../app/config/firebaseConfig";

type Message = {
  id: string;
  usuario?: string;
  texto?: string;
  text?: string;
  fecha?: Timestamp | any;
  type?: "compra" | "venta";
  producto?: string;
  ubicacion?: {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    direccion?: string | null;
  };
};

export default function ChatScreen() {
  const router = useRouter();
  const { productName, sharedLocation } = useLocalSearchParams();
  const safeProductName =
    typeof productName === "string" ? productName : "Producto";

  const [mensajes, setMensajes] = useState<Message[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // 1. Verificar autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Escuchar mensajes del producto en tiempo real
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "mensajes"),
      where("producto", "==", safeProductName),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista: Message[] = [];
        snapshot.forEach((docSnap) => {
          lista.push({ id: docSnap.id, ...docSnap.data() } as Message);
        });
        setMensajes(lista);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
      },
      (error) => {
        console.error("Error al escuchar mensajes:", error);
      }
    );

    return () => unsubscribe();
  }, [safeProductName]);

  // 3. Enviar ubicación compartida automáticamente
  useEffect(() => {
    const locationString =
      typeof sharedLocation === "string"
        ? sharedLocation
        : Array.isArray(sharedLocation)
        ? sharedLocation[0]
        : "";

    if (locationString.trim() !== "" && auth.currentUser) {
      const enviarUbicacionAutomatica = async () => {
        try {
          const userEmail = auth.currentUser?.email || "Anónimo";
          const userId = auth.currentUser?.uid;

          await addDoc(collection(db, "mensajes"), {
            producto: safeProductName,
            texto: `📍 Ubicación compartida: ${locationString}`,
            usuario: userEmail,
            fecha: serverTimestamp(),
            type: "venta",
          });

          if (userId) {
            const conversacionRef = doc(db, "conversaciones", safeProductName);
            await setDoc(
              conversacionRef,
              {
                producto: safeProductName,
                ultimoMensaje: `📍 Ubicación compartida: ${locationString}`,
                userId: userId,
                fecha: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (error) {
          console.error("Error al enviar ubicación:", error);
        }
      };
      enviarUbicacionAutomatica();
    }
  }, [sharedLocation, safeProductName]);

  // 4. Enviar mensaje individual
  const enviarMensaje = async () => {
    if (mensaje.trim() === "" || !auth.currentUser) return;

    const textoAEnviar = mensaje.trim();
    setMensaje(""); // Limpieza inmediata del input para fluidez de UI

    try {
      const userEmail = auth.currentUser.email || "Anónimo";
      const userId = auth.currentUser.uid;

      await addDoc(collection(db, "mensajes"), {
        producto: safeProductName,
        texto: textoAEnviar,
        usuario: userEmail,
        fecha: serverTimestamp(),
        type: "venta",
      });

      const conversacionRef = doc(db, "conversaciones", safeProductName);
      await setDoc(
        conversacionRef,
        {
          producto: safeProductName,
          ultimoMensaje: textoAEnviar,
          userId: userId,
          fecha: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  // 5. Limpiar historial del chat
  const limpiarChat = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "mensajes"),
        where("producto", "==", safeProductName)
      );
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      const conversacionRef = doc(db, "conversaciones", safeProductName);
      await setDoc(
        conversacionRef,
        {
          producto: safeProductName,
          ultimoMensaje: "",
          userId: auth.currentUser.uid,
          fecha: serverTimestamp(),
        },
        { merge: true }
      );

      setMensajes([]);
    } catch (error) {
      console.error("Error al limpiar chat:", error);
    }
  };

  return (
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          {/* Encabezado Flotante */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#059669" />
            </TouchableOpacity>

            <View style={styles.contactInfo}>
              <Text style={styles.contactName} numberOfLines={1}>
                {safeProductName}
              </Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.contactStatus}>En línea</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowMenu(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#059669" />
            </TouchableOpacity>
          </View>

          {/* Lista de Mensajes */}
          <FlatList
            ref={flatListRef}
            data={mensajes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const esMio = item.usuario === auth.currentUser?.email;
              const textoMensaje = item.texto || item.text || "";
              const esUbicacion =
                textoMensaje.includes("📍 Ubicación compartida") ||
                item.ubicacion;

              return (
                <View
                  style={[
                    styles.messageBubble,
                    esMio ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  <Text style={styles.usuarioTexto}>
                    {esMio ? "Tú" : item.usuario?.split("@")[0] || "Usuario"}
                  </Text>

                  {esUbicacion && item.ubicacion ? (
                    <View style={styles.mapPreviewContainer}>
                      <MapView
                        style={styles.miniMap}
                        initialRegion={{
                          latitude: item.ubicacion.latitude,
                          longitude: item.ubicacion.longitude,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                      >
                        <Marker
                          coordinate={{
                            latitude: item.ubicacion.latitude,
                            longitude: item.ubicacion.longitude,
                          }}
                          pinColor="#10B981"
                        />
                      </MapView>
                      <Text
                        style={[
                          styles.messageText,
                          esMio && styles.myMessageText,
                          { marginTop: 6, fontSize: 13 },
                        ]}
                      >
                        {textoMensaje}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[styles.messageText, esMio && styles.myMessageText]}
                    >
                      {textoMensaje}
                    </Text>
                  )}
                </View>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Barra de Entrada de Texto */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#9CA3AF"
                value={mensaje}
                onChangeText={setMensaje}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={enviarMensaje}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#059669", "#10B981"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendGradient}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modal / Menú Desplegable */}
      <Modal
        transparent
        visible={showMenu}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuBox}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    router.push({
                      pathname: "/(tabs)/mapa",
                      params: {
                        chatId: safeProductName,
                        usuarioActualId: auth.currentUser?.uid,
                      },
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: "rgba(16, 185, 129, 0.12)" },
                    ]}
                  >
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#059669"
                    />
                  </View>
                  <Text style={styles.menuText}>Compartir ubicación</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    limpiarChat();
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: "rgba(239, 68, 68, 0.12)" },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuText, { color: "#EF4444" }]}>
                    Limpiar chat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    router.replace("/conversaciones");
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: "rgba(107, 114, 128, 0.12)" },
                    ]}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color="#4B5563"
                    />
                  </View>
                  <Text style={styles.menuText}>Cerrar chat</Text>
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
  backButton: {
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
  menuButton: {
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
  contactInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 12,
  },
  contactName: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 5,
  },
  contactStatus: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "78%",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#059669",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderBottomLeftRadius: 4,
  },
  usuarioTexto: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9CA3AF",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    lineHeight: 20,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  mapPreviewContainer: {
    width: 220,
    height: 160,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 2,
  },
  miniMap: {
    width: "100%",
    height: 110,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 16,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 26,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    paddingHorizontal: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 6,
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingTop: Platform.OS === "ios" ? 90 : 60,
    paddingRight: 20,
  },
  menuBox: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 22,
    padding: 10,
    width: 220,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
});