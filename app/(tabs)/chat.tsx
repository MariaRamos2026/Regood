import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth, db } from "./../../app/config/firebaseConfig";

type Message = {
  id: string;
  usuario?: string;
  texto?: string;
  text?: string;
  fecha?: Timestamp | any;
  type?: "compra" | "venta";
  producto?: string;
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

      // Uso de WriteBatch para una eliminación rápida y atómica
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

  // 6. Cerrar sesión
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{safeProductName}</Text>
          <Text style={styles.contactStatus}>En línea</Text>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
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

          return (
            <View
              style={[
                styles.messageBubble,
                esMio ? styles.myMessage : styles.otherMessage,
                item.type === "compra"
                  ? styles.compraMessage
                  : styles.ventaMessage,
              ]}
            >
              <Text style={styles.usuarioTexto}>{item.usuario}</Text>
              <Text style={styles.messageText}>{textoMensaje}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Barra de Entrada de Texto */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#888"
          value={mensaje}
          onChangeText={setMensaje}
        />
        <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

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
                    router.push("/(tabs)/mapa");
                  }}
                >
                  <Ionicons name="location-outline" size={20} color="#04373b" />
                  <Text style={styles.menuText}>Compartir ubicación</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    limpiarChat();
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#f44336" />
                  <Text style={[styles.menuText, { color: "#f44336" }]}>
                    Limpiar chat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    router.replace("/conversaciones");
                  }}
                >
                  <Ionicons name="chatbubble-outline" size={20} color="#04373b" />
                  <Text style={styles.menuText}>Cerrar chat</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e4fdf7" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#b8908a",
    padding: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 15,
  },

  contactInfo: { flex: 1, marginLeft: 10 },
  contactName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  contactStatus: { color: "#fff", fontSize: 14 },

  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "75%",
  },
  myMessage: { alignSelf: "flex-end" },
  otherMessage: { alignSelf: "flex-start" },
  compraMessage: { backgroundColor: "#d0e8ff" },
  ventaMessage: { backgroundColor: "#ffe4b5" },

  usuarioTexto: { fontSize: 10, color: "#666", marginBottom: 2 },
  messageText: { fontSize: 16, color: "#333" },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    backgroundColor: "#a5726a",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingTop: Platform.OS === "ios" ? 80 : 50,
    paddingRight: 10,
  },
  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: { marginLeft: 10, fontSize: 16, color: "#04373b" },
});
