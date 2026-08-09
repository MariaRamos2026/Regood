import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todo");
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
    {
      name: "Bicicleta Montaña",
      tag: "Como nuevo",
      price: 300,
      imageId: "bici",
      category: "Deportes",
      location: "Lima",
      description: "Bicicleta de montaña resistente con frenos de disco y cambios de 21 velocidades. Ideal para rutas urbanas o de trocha."
    },
    {
      name: "Smart Watch",
      tag: "Gran Oferta",
      price: 200,
      imageId: "reloj",
      category: "Electrónica",
      location: "Lima",
      description: "Reloj inteligente con monitor de ritmo cardíaco, contador de pasos, llamadas Bluetooth y batería de larga duración."
    },
    {
      name: "iPhone 10",
      tag: "Buen estado",
      price: 750,
      imageId: "iphone",
      category: "Electrónica",
      location: "Callao",
      description: "iPhone X de 64 GB en excelente estado. Pantalla Super Retina OLED de 5.8 pulgadas, Face ID y cámaras dobles con modo retrato."
    },
    {
      name: "Zapatillas Nike",
      tag: "Originales",
      price: 50,
      imageId: "zapatillas",
      category: "Moda",
      location: "Cusco",
      description: "Zapatillas deportivas superligeras y cómodas, talla 41. Perfectas para correr o entrenamiento diario."
    },
    {
      name: "Mesa de centro",
      tag: "Madera fina",
      price: 100,
      imageId: "mesa",
      category: "Hogar",
      location: "Lima",
      description: "Mesa de centro rústica en madera maciza. Acabado elegante ideal para complementar cualquier sala de estar."
    },
    {
      name: "Lavadora",
      tag: "Como nuevo",
      price: 800,
      imageId: "lavadora",
      category: "Hogar",
      location: "Lima",
      description: "Lavadora automática de 12 kg con múltiples programas de lavado, centrifugado rápido y ahorro eficiente de agua."
    },
  ];

  const imageMap: Record<string, any> = {
    bici: require("../../assets/images/bici.png"),
    reloj: require("../../assets/images/reloj.png"),
    iphone: require("../../assets/images/iphone.png"),
    zapatillas: require("../../assets/images/zapatillas.png"),
    mesa: require("../../assets/images/mesa.png"),
    lavadora: require("../../assets/images/lavadora.png"),
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "Todo" || p.category === selectedCategory;
    const matchesSearch =
      searchText.trim() !== ""
        ? p.name.toLowerCase().includes(searchText.toLowerCase().trim())
        : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#E0F7F1", "#E8FAEE", "#FFF0E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.glowOrb, styles.orbTopLeft]} />
      <View style={[styles.glowOrb, styles.orbBottomRight]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetingTitle}>¡Hola! 👋</Text>
              <Text style={styles.greetingSubtitle}>
                ¿Qué quieres encontrar hoy?
              </Text>
            </View>
            <Image
              source={require("../../assets/images/logosinfondo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <View
            style={[
              styles.searchContainer,
              isSearchFocused && styles.searchContainerFocused,
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={isSearchFocused ? "#10B981" : "#A0AEC0"}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              placeholderTextColor="#A0AEC0"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchText !== "" && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={18} color="#A0AEC0" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionHeaderLabel}>CATEGORÍAS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScrollView}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  activeOpacity={0.8}
                  style={styles.categoryItem}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleSelected,
                    ]}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={22}
                      color={isSelected ? "#FFFFFF" : "#059669"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>
            {selectedCategory === "Todo"
              ? "Productos Destacados"
              : `Categoría: ${selectedCategory}`}
          </Text>

          <View style={styles.productsGrid}>
            {filteredProducts.map((prod) => (
              <TouchableOpacity
                key={prod.name}
                activeOpacity={0.9}
                style={styles.productCard}
                onPress={() =>
                  router.push({
                    pathname: "/detalleproducto",
                    params: {
                      name: prod.name,
                      price: prod.price,
                      description: prod.description,
                      location: prod.location || "Ubicación no disponible",
                      imageId: prod.imageId,
                    },
                  })
                }
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={imageMap[prod.imageId]}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  {prod.tag && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{prod.tag}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {prod.name}
                  </Text>

                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={12} color="#059669" />
                    <Text style={styles.locationText}>{prod.location}</Text>
                  </View>

                  <Text style={styles.productPrice}>S/ {prod.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredProducts.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#F59E0B" />
              <Text style={styles.noResultsTitle}>Sin resultados</Text>
              <Text style={styles.noResultsText}>
                No encontramos productos que coincidan con tu búsqueda.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.navbarWrapper}>
          <View style={styles.navbar}>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
              <Ionicons name="home" size={24} color="#059669" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/buscar")}>
              <Ionicons name="search-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.fabButton} onPress={() => router.push("/publicar")}>
              <LinearGradient
                colors={["#059669", "#10B981", "#F59E0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fabGradient}
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/publicaciones")}>
              <Ionicons name="document-text-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/perfil")}>
              <Ionicons name="person-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#E0F7F1" },
  glowOrb: { position: "absolute", borderRadius: 150, opacity: 0.35 },
  orbTopLeft: { width: 260, height: 260, top: -50, left: -50, backgroundColor: "#10B981" },
  orbBottomRight: { width: 280, height: 280, bottom: 20, right: -50, backgroundColor: "#F59E0B" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  greetingTitle: { fontSize: 24, fontWeight: "900", color: "#1F2937", letterSpacing: -0.5 },
  greetingSubtitle: { fontSize: 14, color: "#059669", fontWeight: "700" },
  headerLogo: { width: 48, height: 48 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainerFocused: { borderColor: "#10B981", shadowColor: "#10B981", shadowOpacity: 0.15, shadowRadius: 8 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#1F2937", fontWeight: "600" },
  sectionHeaderLabel: { fontSize: 11, fontWeight: "800", color: "#374151", letterSpacing: 1, marginBottom: 10 },
  categoriesScrollView: { marginHorizontal: -20, marginBottom: 20 },
  categoriesContainer: { paddingHorizontal: 20, flexDirection: "row", gap: 14 },
  categoryItem: { alignItems: "center" },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircleSelected: { backgroundColor: "#059669", borderColor: "#10B981" },
  categoryText: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  categoryTextSelected: { color: "#059669", fontWeight: "900" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937", marginBottom: 14 },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  productCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: { width: "60%", height: 90, borderRadius: 14, overflow: "hidden", backgroundColor: "#F3F4F6", position: "relative" },
  productImage: { width: "100%", height: "100%" },
  tagBadge: { position: "absolute", top: 6, left: 6, backgroundColor: "rgba(5, 150, 105, 0.9)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  productInfo: { paddingTop: 10, paddingHorizontal: 2 },
  productName: { fontSize: 14, fontWeight: "800", color: "#1F2937", marginBottom: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 6 },
  locationText: { fontSize: 11, color: "#059669", fontWeight: "600" },
  productPrice: { fontSize: 16, fontWeight: "900", color: "#D97706" },
  noResultsContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  noResultsTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937", marginTop: 10 },
  noResultsText: { fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 4 },
  navbarWrapper: { position: "absolute", bottom: 15, left: 20, right: 20, alignItems: "center" },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 30,
    height: 60,
    width: "100%",
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  fabButton: { top: -15, shadowColor: "#10B981", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  fabGradient: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center" },
});

