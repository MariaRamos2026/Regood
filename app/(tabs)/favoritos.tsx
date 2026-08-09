import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../config/firebaseConfig";

// Mapeo de imágenes locales por defecto
const imageMap: Record<string, any> = {
  bici: require("../../assets/images/bici.png"),
  reloj: require("../../assets/images/reloj.png"),
  iphone: require("../../assets/images/iphone.png"),
  zapatillas: require("../../assets/images/zapatillas.png"),
  mesa: require("../../assets/images/mesa.png"),
  lavadora: require("../../assets/images/lavadora.png"),
  sofa: require("../../assets/images/sofa.png"),
  lampara: require("../../assets/images/lampara.png"),
  pelota: require("../../assets/images/pelota.webp"),
  silla: require("../../assets/images/silla.png"),
};

export default function FavoritosScreen() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "favoritos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((docSnap) => {
        lista.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFavoritos(lista);
    });
    return unsubscribe;
  }, []);

  // Eliminar favorito
  const eliminarFavorito = async (id: string) => {
    try {
      await deleteDoc(doc(db, "favoritos", id));
    } catch (error) {
      console.log("Error al eliminar favorito:", error);
    }
  };

  const renderItem = ({ item }: any) => {
    const titulo = item.producto || item.titulo || item.name || "Producto sin nombre";
    const precio = item.precio || item.price ? `S/ ${item.precio || item.price}` : "";
    
    // Evalúa todas las posibles propiedades de texto guardadas en Firebase/Estado
    const descripcion =
      item.descripcion ||
      item.description ||
      item.tag ||
      item.detalles ||
      "Sin descripción disponible para este producto.";

    // Lógica para resolver la fuente de la imagen
    const imageSource =
      item.imagen || item.image
        ? { uri: item.imagen || item.image }
        : item.imageId && imageMap[item.imageId]
        ? imageMap[item.imageId]
        : item.imageId && typeof item.imageId === "string" && item.imageId.startsWith("http")
        ? { uri: item.imageId }
        : null;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/detalleproducto",
            params: {
              name: titulo,
              description: descripcion,
              price: item.precio || item.price,
              location: item.ubicacion || item.location || "Lima",
              imageId: item.imageId,
            },
          })
        }
      >
        {/* Contenedor de la Imagen */}
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.productImage} />
          ) : (
            <Ionicons name="image-outline" size={28} color="#A0AEC0" />
          )}
        </View>

        {/* Información detallada con título, precio y descripción */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {titulo}
          </Text>
          {precio ? <Text style={styles.price}>{precio}</Text> : null}
          
        </View>

        {/* Botón corazón para eliminar */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => eliminarFavorito(item.id)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={20} color="#EF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
        {/* Botón de regreso flotante */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#059669" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Favoritos ❤️</Text>
          <Text style={styles.headerSubtitle}>
            Tus productos guardados para revisar más tarde
          </Text>
        </View>

        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-dislike-outline" size={48} color="#F59E0B" />
              </View>
              <Text style={styles.emptyTitle}>No tienes favoritos guardados</Text>
              <Text style={styles.emptySubtitle}>
                Explora productos en la app y toca el corazón para guardarlos en esta lista.
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
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D97706",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
    lineHeight: 16,
  },
  heartButton: {
    padding: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 14,
    alignSelf: "flex-start",
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