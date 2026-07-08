import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todo");
  const [searchText, setSearchText] = useState("");
  
  type Category = {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
  };

  const categories: Category[] = [
    { name: "Todo", icon: "grid-outline" },
    { name: "Electrónica", icon: "laptop-outline" },
    { name: "Hogar", icon: "home-outline" },
    { name: "Moda", icon: "shirt-outline" },
    { name: "Deportes", icon: "medal-outline" },
  ];

  const products = [
    { name: "Bicicleta Montaña", tag: "Como nuevo", price: 300, imageId: "bici", category: "Deportes", location: "Lima" },
    { name: "Smart Watch", tag: "Gran Oferta", price: 200, imageId: "reloj", category: "Electrónica", location: "Lima" },
    { name: "iPhone 10", tag: null, price: 750, imageId: "iphone", category: "Electrónica", location: "Callao" },
    { name: "Zapatillas Nike", tag: null, price: 50, imageId: "zapatillas", category: "Moda", location: "Cusco" },
    { name: "Mesa de centro", tag: null, price: 100, imageId: "mesa", category: "Hogar", location: "Lima" },
    { name: "Lavadora", tag: "Como nuevo", price: 800, imageId: "lavadora", category: "Hogar", location: "Lima" },
  ];

  const imageMap: Record<string, any> = {
    bici: require('../../assets/images/bici.png'),
    reloj: require('../../assets/images/reloj.png'),
    iphone: require('../../assets/images/iphone.png'),
    zapatillas: require('../../assets/images/zapatillas.png'),
    mesa: require('../../assets/images/mesa.png'),
    lavadora: require('../../assets/images/lavadora.png'),
  };


  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Todo" || p.category === selectedCategory;
    const matchesSearch = searchText.trim() !== "" 
      ? p.name.toLowerCase().includes(searchText.toLowerCase().trim())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola 👋 ¿Qué quieres encontrar hoy?</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.name} 
            style={styles.categoryButton}
            onPress={() => setSelectedCategory(cat.name)} 
          >
            <View style={[styles.iconCircle, selectedCategory === cat.name && styles.iconCircleSelected]}>
              <Ionicons name={cat.icon} size={24} color="#04373b" />
            </View>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>
          {selectedCategory === "Todo" ? "Productos destacados y recientes" : `Categoría: ${selectedCategory}`}
        </Text>

        <View style={styles.productsRow}>
          {filteredProducts.map((prod) => (
            <TouchableOpacity 
              key={prod.name} 
              style={styles.productCard}
              onPress={() => router.push({
                pathname: "/detalleproducto",
                params: {
                  name: prod.name,
                  price: prod.price,
                  description: prod.tag || "Sin descripción",
                  location: prod.location || "Ubicación no disponible",
                  imageId: prod.imageId, 
                }
              })}
            >
              <Image source={imageMap[prod.imageId]} style={styles.productImage} />
              <Text style={styles.productName}>{prod.name}</Text>
              {prod.tag && <Text style={styles.productTag}>{prod.tag}</Text>}
              {prod.price && <Text style={styles.productPrice}>S/. {prod.price}</Text>}
            </TouchableOpacity>
          ))}
        </View>


        {filteredProducts.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Ionicons name="search-outline" size={50} color="#777" />
            <Text style={styles.noResults}>No se encontraron productos</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={26} color="#04373b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/buscar')}>
          <Ionicons name="search-outline" size={26} color="#04373b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/publicar')}>
          <Ionicons name="add-circle" size={40} color="#2ecc71" /> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/publicaciones')}>
          <Ionicons name="document-text-outline" size={26} color="#04373b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/perfil')}>
          <Ionicons name="person-outline" size={26} color="#04373b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },
  greeting: { fontSize: 18, fontWeight: "bold", marginBottom: 35, marginTop: 30, color: "#04373b" },
  searchInput: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 35, borderWidth: 1, borderColor: "#CCC" },
  categories: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  categoryButton: { alignItems: "center" },
  categoryText: { fontWeight: "bold", color: "#04373b", marginTop: 4, fontSize: 12 },
  iconCircle: { backgroundColor: "#fff", borderRadius: 50, padding: 12, elevation: 2 },
  iconCircleSelected: { borderWidth: 2, borderColor: "#2ecc71" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10, marginTop: 30, color: "#04373b" },
  productsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  productCard: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginTop: 30, width: "48%", marginBottom: 20, alignItems: "center" },
  productImage: { width: 100, height: 100, marginBottom: 10 },
  productName: { fontWeight: "bold", fontSize: 16, color: "#04373b" },
  productTag: { color: "#04373b", fontSize: 16 },
  productPrice: { color: "#ca5045", fontSize: 16, fontWeight: "bold" },
  navbar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderColor: "#CCC", backgroundColor: "#fff" },
  navText: { color: "#04373b", fontWeight: "bold" },
  noResults: { textAlign: "center", color: "#777", marginTop: 10, fontSize: 16, fontWeight: "bold" },
});


