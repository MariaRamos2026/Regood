import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../app/config/firebaseConfig";

export default function ConversacionesScreen() {
  const router = useRouter();

  // 👇 Conversaciones iniciales (locales)
  const [conversaciones, setConversaciones] = useState<any[]>([
    { id: "1", producto: "Televisor Hyundai", ultimoMensaje: "Hola!" },
    { id: "2", producto: "Refrigerador LG", ultimoMensaje: "¿Disponible?" },
    { id: "3", producto: "Licuadora Oster", ultimoMensaje: "Buen estado?" },
  ]);

  // 👇 Escuchar conversaciones en tiempo real desde Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "conversaciones"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("fecha", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((docSnap) => {
        lista.push({ id: docSnap.id, ...docSnap.data() });
      });

      // 👇 Combinar las locales con las de Firestore (sin duplicar)
      const combinadas = [
        ...conversaciones.filter(
          (c) => !lista.some((f) => f.producto === c.producto)
        ),
        ...lista,
      ];

      setConversaciones(combinadas);
    });

    return unsubscribe;
  }, []);

  // 👇 Eliminar conversación de Firestore
  const eliminarConversacion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "conversaciones", id));
      // También la quitamos del estado local
      setConversaciones(conversaciones.filter((c) => c.id !== id));
    } catch (error) {
      console.log("Error al eliminar conversación:", error);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: { conversacionId: item.id, productName: item.producto },
          })
        }
      >
        <Text style={styles.producto}>{item.producto}</Text>
        <Text style={styles.ultimoMensaje}>{item.ultimoMensaje}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => eliminarConversacion(item.id)}>
        <Ionicons name="trash" size={22} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con botón volver */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.header}>Mis Conversaciones 💬</Text>
      </View>

      <FlatList
        data={conversaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  header: { fontSize: 22, fontWeight: "bold", color: "#04373b" },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  producto: { fontSize: 16, fontWeight: "600", color: "#04373b" },
  ultimoMensaje: { fontSize: 14, color: "#666" },
});
