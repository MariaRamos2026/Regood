import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BuscarScreen() {
  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minPrice, setMinPrice] = useState<number>(0);

  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

  const categories = ["Todos", "Electrónica", "Hogar", "Moda", "Deportes"];

  const products = [
    { name: "Bicicleta", price: 300, imageId: "bici", category: "Deportes", location: "Lima" },
    { name: "Smart Watch", price: 200, imageId:"reloj", category: "Electrónica", location: "Lima" },
    { name: "iPhone 12", price: 750, imageId: "iphone", category: "Electrónica", location: "Callao" },
    { name: "Zapatillas Nike", price: 50, imageId: "zapatillas", category: "Moda", location: "Cusco" },
    { name: "Sofá", price: 300, imageId: "sofa", category: "Hogar", location: "Lima" },
    { name: "Lámpara", price: 25, imageId: "lampara", category: "Hogar", location: "Lima" },
    { name: "Pelota", price: 40, imageId: "pelota", category: "Deportes", location: "Lima" },
    { name: "Silla", price: 60, imageId: "silla", category: "Hogar", location: "Lima" },
  ];

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

  const filteredProducts = products.filter(p => {
    const matchSearch =
      searchQuery.trim() !== ""
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        : true;
    const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#04373b" />
      </TouchableOpacity>

      <Text style={styles.greeting}>Buscar productos 🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Escribe lo que buscas..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.categories}>
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.categoryButton, selectedCategory === cat && styles.categorySelected]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.filterTitle}>Rango de precios (S/.)</Text>
      <View style={styles.priceRange}>
        <TextInput
          style={styles.priceInput}
          keyboardType="numeric"
          value={tempMinPrice.toString()}
          onChangeText={(val) => setTempMinPrice(Number(val))}
          placeholder="Mínimo"
        />
        <Text style={styles.priceSeparator}>-</Text>
        <TextInput
          style={styles.priceInput}
          keyboardType="numeric"
          value={tempMaxPrice.toString()}
          onChangeText={(val) => setTempMaxPrice(Number(val))}
          placeholder="Máximo"
        />
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => {
          setMinPrice(tempMinPrice);
          setMaxPrice(tempMaxPrice);
        }}
      >
        <Text style={styles.applyButtonText}>Aplicar precio</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Resultados</Text>
        <View style={styles.productsRow}>
          {visibleProducts.map((prod) => (
            <TouchableOpacity 
              key={prod.name} 
              style={styles.productCard}
              onPress={() => router.push({
                pathname: "/detalleproducto",
                params: {
                  name: prod.name,
                  price: prod.price,
                  description: `Este producto pertenece a la categoría ${prod.category}.`,
                  category: prod.category,
                  location: prod.location,
                  imageId: prod.imageId,
                }
              })}
            >
              {imageMap[prod.imageId] ? (
                <Image source={imageMap[prod.imageId]} style={styles.productImage} />
              ) : (
                <Ionicons name="image-outline" size={60} color="#777" />
              )}
              <Text style={styles.productName}>{prod.name}</Text>
              <Text style={styles.productPrice}>S/. {prod.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {visibleCount < filteredProducts.length && (
          <TouchableOpacity 
            style={styles.loadMoreButton} 
            onPress={() => setVisibleCount(visibleCount + 4)}
          >
            <Text style={styles.loadMoreText}>Ver más</Text>
          </TouchableOpacity>
        )}

        {filteredProducts.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Ionicons name="search-outline" size={50} color="#777" />
            <Text style={styles.noResults}>No se encontraron productos</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },
  backButton: { marginBottom: 10, marginTop: 10 },
  greeting: { fontSize: 18, fontWeight: "bold", marginBottom: 20, marginTop: 10, color: "#04373b" },
  searchInput: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: "#CCC" },
  filterTitle: { fontSize: 16, fontWeight: "bold", color: "#04373b", marginBottom: 5 },
  categories: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
  categoryButton: { padding: 8, borderRadius: 6, backgroundColor: "#fff", marginBottom: 8, width: "30%", alignItems: "center" },
  categorySelected: { backgroundColor: "#e7c1bb" },
  categoryText: { color: "#04373b", fontWeight: "bold" },
  priceRange: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  priceInput: { backgroundColor: "#fff", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#CCC", width: "40%" },
  priceSeparator: { fontSize: 18, fontWeight: "bold", color: "#04373b" },
  applyButton: { backgroundColor: "#b89690", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  applyButtonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#04373b" },
  productsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  productCard: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 20, width: "48%", alignItems: "center" },
  productImage: { width: "100%", height: 100, resizeMode: "contain", marginBottom: 10 },
  productName: { fontSize: 14, fontWeight: "bold", color: "#04373b", marginBottom: 5, textAlign: "center" },
  productPrice: { fontSize: 14, color: "#FF6F61", fontWeight: "bold" },
  loadMoreButton: { backgroundColor: "#b89690", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  loadMoreText: { color: "#fff", fontWeight: "bold" },
  noResults: { color: "#777", marginTop: 10 },
});