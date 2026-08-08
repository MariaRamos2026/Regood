import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { app } from "../config/firebaseConfig";

export default function FavoritosScreen() {
  const router = useRouter();
  const db = getFirestore(app);

  // Lista de favoritos con imágenes correspondientes
  const [favoritos] = useState([
    {
      id: "1",
      titulo: "Televisor Hyundai",
      descripcion: "Televisor de 30 pulgadas",
      precio: "300.00",
      ubicacion: "Ciudad de México",
      imagen: require("../../assets/images/televisor.png"),
    },
    {
      id: "2",
      titulo: "Refrigerador LG",
      descripcion: "Refrigerador de 2 puertas",
      precio: "500.00",
      ubicacion: "Guadalajara",
      imagen: require("../../assets/images/refrigerador.png"),
    },
    {
      id: "3",
      titulo: "Licuadora Oster",
      descripcion: "Licuadora de 1000 vatios",
      precio: "120.00",
      ubicacion: "Monterrey",
      imagen: require("../../assets/images/licuadora.png"),
    },
  ]);

  // Guardar en Firestore
  async function guardarFavorito(item: any) {
    try {
      await addDoc(collection(db, "favoritos"), {
        titulo: item.titulo,
        descripcion: item.descripcion,
        precio: item.precio,
        ubicacion: item.ubicacion,
        creadoEn: new Date(),
      });
      console.log("Favorito guardado:", item.titulo);
    } catch (e) {
      console.error("Error al guardar favorito:", e);
    }
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Ionicons name="heart" size={24} color="#e74c3c" />
        <Image source={item.imagen} style={styles.productImage} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.subtitle}>{item.descripcion}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/detalleproducto",
            params: {
              name: item.titulo,
              description: item.descripcion,
              price: item.precio,
              location: item.ubicacion,
              imageId: item.imagen, // ahora dinámico
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

