import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../app/config/firebaseConfig";

export default function ConversacionesScreen() {
  const router = useRouter();

  // Conversaciones iniciales (locales)
  const [conversaciones, setConversaciones] = useState<any[]>([
    { id: "1", producto: "Televisor Hyundai", ultimoMensaje: "Hola!" },
    { id: "2", producto: "Refrigerador LG", ultimoMensaje: "¿Disponible?" },
    { id: "3", producto: "Licuadora Oster", ultimoMensaje: "Buen estado?" },
  ]);

  // Escuchar conversaciones en tiempo real desde Firestore
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

      // Combinar las locales con las de Firestore (sin duplicar)
      setConversaciones((prev) => {
        const combinadas = [
          ...prev.filter(
            (c) => !lista.some((f) => f.producto === c.producto)
          ),
          ...lista,
        ];
        return combinadas;
      });
    });

    return unsubscribe;
  }, []);

  // Eliminar conversación de Firestore y local
  const eliminarConversacion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "conversaciones", id));
      setConversaciones((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log("Error al eliminar conversación:", error);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: { conversacionId: item.id, productName: item.producto },
          })
        }
      >
        <View style={styles.avatarCircle}>
          <Ionicons name="chatbubbles-outline" size={22} color="#059669" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.producto} numberOfLines={1}>
            {item.producto}
          </Text>
          <Text style={styles.ultimoMensaje} numberOfLines={1}>
            {item.ultimoMensaje || "Sin mensajes aun..."}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => eliminarConversacion(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

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
        {/* Botón de regreso flotante */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#059669" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Chats 💬</Text>
          <Text style={styles.headerSubtitle}>
            Historial de tus conversaciones activas
          </Text>
        </View>

        <FlatList
          data={conversaciones}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbox-ellipses-outline" size={48} color="#F59E0B" />
              </View>
              <Text style={styles.emptyTitle}>Sin conversaciones</Text>
              <Text style={styles.emptySubtitle}>
                Cuando inicies un chat sobre un producto, aparecerá listado aquí.
              </Text>
            </View>
          }
        />
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
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "700",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 12,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  producto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },
  ultimoMensaje: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});