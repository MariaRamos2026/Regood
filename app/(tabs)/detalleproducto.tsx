import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetalleProducto() {
  const router = useRouter();
  const { name, price, description, location, imageId } = useLocalSearchParams();


  const imageMap: Record<string, any> = {
    bici: require('../../assets/images/bici.png'),
    reloj: require('../../assets/images/reloj.png'),
    iphone: require('../../assets/images/iphone.png'),
    zapatillas: require('../../assets/images/zapatillas.png'),
    mesa: require('../../assets/images/mesa.png'),
    lavadora: require('../../assets/images/lavadora.png'),
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#04373b" />
      </TouchableOpacity>


      {imageId && (
        <Image source={imageMap[imageId as string]} style={styles.productImage} />
      )}

      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>S/. {price}</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.productDescription}>{description}</Text>

      <Text style={styles.sectionTitle}>Ubicación</Text>
      <Text style={styles.productLocation}>📍 {location}</Text>


      <TouchableOpacity 
        style={styles.chatButton} 
        onPress={() => router.push({
        pathname: "/chat",
        params: { productName: name } 
        })}
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
  productName: { fontSize: 22, fontWeight: "bold", color: "#04373b", marginBottom: 10 },
  productPrice: { fontSize: 20, fontWeight: "bold", color: "#FF6F61", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#04373b", marginTop: 15, marginBottom: 5 },
  productDescription: { fontSize: 16, color: "#333", marginBottom: 15 },
  productLocation: { fontSize: 16, color: "#555", marginBottom: 20 },
  chatButton: { backgroundColor: "#b8908a", padding: 15, borderRadius: 8, alignItems: "center" },
  chatButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});



