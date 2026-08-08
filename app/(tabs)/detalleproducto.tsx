import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { app } from "../../app/config/firebaseConfig";

export default function DetalleProducto() {
  const router = useRouter();
  const { name, price, description, location, imageId } = useLocalSearchParams();
  const db = getFirestore(app);

  const [favorito, setFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState<string | null>(null);

  // Verificar si ya está en favoritos
  useEffect(() => {
    const verificarFavorito = async () => {
      const q = query(collection(db, "favoritos"), where("producto", "==", name));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setFavorito(true);
        setFavoritoId(snapshot.docs[0].id);
      }
    };
    verificarFavorito();
  }, [name]);

  // Toggle favorito
  const toggleFavorito = async () => {
    try {
      if (favorito && favoritoId) {
        // Eliminar de favoritos
        await deleteDoc(doc(db, "favoritos", favoritoId));
        setFavorito(false);
        setFavoritoId(null);
        console.log("Favorito eliminado:", name);
      } else {
        // Guardar en favoritos
        const docRef = await addDoc(collection(db, "favoritos"), {
          producto: name,
          precio: price,
          descripcion: description || defaultDescription,
          ubicacion: location || "Ubicación no disponible",
          imageId: imageId,
          fecha: serverTimestamp(),
        });
        setFavorito(true);
        setFavoritoId(docRef.id);
        console.log("Favorito guardado:", name);
      }
    } catch (error) {
      console.log("Error al manejar favorito:", error);
    }
  };

  const defaultDescription = `Este producto pertenece a la categoría indicada y está disponible para entrega inmediata.`;

  // Resolver imagen
  const imageMap: Record<string, any> = {
    bici: require('../../assets/images/bici.png'),
    reloj: require('../../assets/images/reloj.png'),
    iphone: require('../../assets/images/iphone.png'),
    zapatillas: require('../../assets/images/zapatillas.png'),
    mesa: require('../../assets/images/mesa.png'),
    lavadora: require('../../assets/images/lavadora.png'),
    sofa: require('../../assets/images/sofa.png'),
    lampara: require('../../assets/images/lampara.png'),
    pelota: require('../../assets/images/pelota.webp'),
    silla: require('../../assets/images/silla.png'),
  };

  let resolvedImage: any = null;
  if (imageId) {
    if (typeof imageId === "string" && imageMap[imageId]) {
      resolvedImage = imageMap[imageId];
    } else {
      resolvedImage = imageId;
    }
  }

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#04373b" />
      </TouchableOpacity>

      {/* Imagen del producto */}
      {resolvedImage ? (
        <Image source={resolvedImage} style={styles.productImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={60} color="#777" />
          <Text style={{ color: "#777" }}>Sin imagen disponible</Text>
        </View>
      )}

      {/* Nombre + corazón */}
      <View style={styles.nameRow}>
        <Text style={styles.productName}>{name}</Text>
        <TouchableOpacity onPress={toggleFavorito}>
              <Ionicons
                name={favorito ? "heart" : "heart-outline"} 
                  size={26}
                    color={favorito ? "#e74c3c" : "#04373b"}  
                  />
        </TouchableOpacity>

      </View>

      <Text style={styles.productPrice}>S/. {price}</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.productDescription}>
        {description || defaultDescription}
      </Text>

      <Text style={styles.sectionTitle}>Ubicación</Text>
      <Text style={styles.productLocation}>📍 {location || "Ubicación no disponible"}</Text>

      {/* Botón de acción: Iniciar chat */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: { productName: name },
          })
        }
      >
        <Text style={styles.chatButtonText}>Iniciar chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },
  backButton: { marginBottom: 10, marginTop: 20 },
  productImage: { width: "100%", height: 250, resizeMode: "contain", marginBottom: 20, marginTop: 20 },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: { fontSize: 22, fontWeight: "bold", color: "#04373b" },
  productPrice: { fontSize: 20, fontWeight: "bold", color: "#FF6F61", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#04373b", marginTop: 15, marginBottom: 5 },
  productDescription: { fontSize: 16, color: "#333", marginBottom: 15 },
  productLocation: { fontSize: 16, color: "#555", marginBottom: 20 },
  chatButton: { backgroundColor: "#b8908a", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  chatButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});





