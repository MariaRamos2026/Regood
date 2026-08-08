import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../config/firebaseConfig";

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
      console.log("Favorito eliminado:", id);
    } catch (error) {
      console.log("Error al eliminar favorito:", error);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        {/* Corazón toggle: al hacer click se elimina */}
        <TouchableOpacity onPress={() => eliminarFavorito(item.id)}>
          <Ionicons name="heart" size={24} color="#e74c3c" />
        </TouchableOpacity>

        {/* Imagen dinámica */}
        {item.imageId ? (
          typeof item.imageId === "string" ? (
            <Image source={{ uri: item.imageId }} style={styles.productImage} />
          ) : (
            <Image source={item.imageId} style={styles.productImage} />
          )
        ) : (
          <Ionicons name="image-outline" size={40} color="#777" />
        )}

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{item.producto || item.titulo}</Text>
          <Text style={styles.subtitle}>{item.descripcion}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/detalleproducto",
            params: {
              name: item.producto || item.titulo,
              description: item.descripcion,
              price: item.precio,
              location: item.ubicacion,
              imageId: item.imageId,
            },
          })
        }
      >
        <Ionicons name="chevron-forward-outline" size={20} color="#04373b" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botón de volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#04373b" />
      </TouchableOpacity>

      <Text style={styles.header}>Mis Favoritos ❤️</Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  header: { fontSize: 22, fontWeight: "bold", color: "#04373b", marginTop: 90, marginBottom: 20 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  productImage: { width: 60, height: 60, borderRadius: 8, marginLeft: 10 },
  title: { fontSize: 16, fontWeight: "600", color: "#04373b" },
  subtitle: { fontSize: 14, color: "#666" },
});

