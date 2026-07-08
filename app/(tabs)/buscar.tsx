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

  const categories = ["Todos", "Electrónica", "Hogar", "Moda", "Deportes"];

  const products = [
    { name: "Bicicleta", price: 300, image: require('../../assets/images/bici.png'), category: "Deportes" },
    { name: "Smart Watch", price: 200, image: require('../../assets/images/reloj.png'), category: "Electrónica" },
    { name: "iPhone 12", price: 750, image: require('../../assets/images/iphone.png'), category: "Electrónica" },
    { name: "Zapatillas Nike", price: 50, image: require('../../assets/images/zapatillas.png'), category: "Moda" },
    { name: "Sofá", price: 300, image: require('../../assets/images/sofa.png'), category: "Hogar" },
    { name: "Lámpara", price: 25, image: require('../../assets/images/lampara.png'), category: "Hogar" },
    { name: "Pelota", price: 40, image: require('../../assets/images/pelota.webp'), category: "Deportes" },
    { name: "Silla", price: 60, image: require('../../assets/images/silla.png'), category: "Hogar" },
  ];

  const [estado, setEstado] = useState<string>("Todos");

<View style={styles.categories}>
  {["Todos", "Nuevo", "Usado", "Oferta"].map(opt => (
    <TouchableOpacity
      key={opt}
      style={[styles.categoryButton, estado === opt && styles.categorySelected]}
      onPress={() => setEstado(opt)}
    >
      <Text style={styles.categoryText}>{opt}</Text>
    </TouchableOpacity>
  ))}
</View>

  const filteredProducts = products.filter(p => {
  const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
  const matchPrice = p.price <= maxPrice;
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

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Resultados</Text>
        <View style={styles.productsRow}>
          {visibleProducts.map((prod) => (
            <View key={prod.name} style={styles.productCard}>
              <Image source={prod.image} style={styles.productImage} />
              <Text style={styles.productName}>{prod.name}</Text>
              <Text style={styles.productPrice}>S/. {prod.price}</Text>
            </View>
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
          <Text style={styles.noResults}>No se encontraron productos</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#d9faf1", 
    padding: 20 
},
  backButton: { 
    marginBottom: 10, 
    marginTop: 20
},
  greeting: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 20, 
    marginTop: 20, 
    color: "#04373b" 
},
  searchInput: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: "#CCC" 
},
  categories: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 10 
},
  categoryButton: { 
    padding: 8, 
    borderRadius: 6, 
    backgroundColor: "#fff" 
},
  categorySelected: { 
    backgroundColor: "#e7c1bb" 
},
  categoryText: { 
    color: "#04373b", 
    fontWeight: "bold" ,
    marginBottom: 10, 
},
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#04373b" 
},
  productsRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
},
  productCard: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 10, 
    width: "48%", 
    alignItems: "center", 
    marginBottom: 20 
},
  productImage: { 
    width: 100, 
    height: 100, 
    marginBottom: 10, 
    resizeMode: "contain" 
},
  productName: { 
    fontWeight: "bold", 
    color: "#04373b" 
},
  productPrice: { color: "#FF6F61", 
    fontWeight: "bold" 
},
  loadMoreButton: { 
    backgroundColor: "#b89690", 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 10 
},
  loadMoreText: { 
    color: "#fff", 
    fontWeight: "bold" 
},
  noResults: { 
    textAlign: "center", 
    color: "#777", 
    marginTop: 20 
}
});