import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function BuscarScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minPrice, setMinPrice] = useState<number>(0);

  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

  const categories = ["Todos", "Electrónica", "Hogar", "Moda", "Deportes"];

  const products = [
    { name: "Bicicleta", price: 300, imageId: "bici", category: "Deportes", location: "Lima", description: "Bicicleta todo terreno ligera con suspensión delantera, lista para uso diario." },
    { name: "Smart Watch", price: 200, imageId: "reloj", category: "Electrónica", location: "Lima", description: "Smartwatch con conectividad a iOS y Android, resistencia al agua y medición del sueño." },
    { name: "iPhone 12", price: 750, imageId: "iphone", category: "Electrónica", location: "Callao", description: "iPhone 12 de 128 GB en excelente estado con pantalla Super Retina OLED y cámaras de alta calidad." },
    { name: "Zapatillas Nike", price: 50, imageId: "zapatillas", category: "Moda", location: "Cusco", description: "Zapatillas deportivas livianas con suela ergonómica para máximo confort al caminar." },
    { name: "Sofá", price: 300, imageId: "sofa", category: "Hogar", location: "Lima", description: "Sofá acogedor de 3 cuerpos tapizado en tela resistente al agua de alta durabilidad." },
    { name: "Lámpara", price: 25, imageId: "lampara", category: "Hogar", location: "Lima", description: "Lámpara de escritorio LED articulada con ajuste de brillo táctil y tono de luz cálido." },
    { name: "Pelota", price: 40, imageId: "pelota", category: "Deportes", location: "Lima", description: "Balón oficial de fútbol confeccionado con materiales duraderos y excelente rebote." },
    { name: "Silla", price: 60, imageId: "silla", category: "Hogar", location: "Lima", description: "Silla ergonómica de escritorio con altura regulable y respaldo transpirable." },
  ];

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

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      searchQuery.trim() !== ""
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        : true;
    const matchCategory =
      selectedCategory === "Todos" || p.category === selectedCategory;
    const matchPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#059669" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Buscar productos 🔍</Text>
              <Text style={styles.subtitle}>
                Encuentra artículos sostenibles cerca de ti
              </Text>
            </View>

            <View style={styles.glassCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PALABRA CLAVE</Text>
                <View
                  style={[
                    styles.searchContainer,
                    isSearchFocused && styles.searchContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="search"
                    size={18}
                    color={isSearchFocused ? "#10B981" : "#A0AEC0"}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Escribe lo que buscas..."
                    placeholderTextColor="#A0AEC0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchQuery !== "" && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={18} color="#A0AEC0" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CATEGORÍA</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContainer}
                >
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        activeOpacity={0.8}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={["#059669", "#10B981"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.categoryChipSelected}
                          >
                            <Text style={styles.categoryChipTextSelected}>
                              {cat}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.categoryChip}>
                            <Text style={styles.categoryChipText}>{cat}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>RANGO DE PRECIOS (S/)</Text>
                <View style={styles.priceRangeContainer}>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.priceCurrency}>S/</Text>
                    <TextInput
                      style={styles.priceInput}
                      keyboardType="numeric"
                      value={tempMinPrice.toString()}
                      onChangeText={(val) => setTempMinPrice(Number(val) || 0)}
                      placeholder="Mínimo"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  <Text style={styles.priceSeparator}>—</Text>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.priceCurrency}>S/</Text>
                    <TextInput
                      style={styles.priceInput}
                      keyboardType="numeric"
                      value={tempMaxPrice.toString()}
                      onChangeText={(val) => setTempMaxPrice(Number(val) || 0)}
                      placeholder="Máximo"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.btnShadow}
                onPress={() => {
                  setMinPrice(tempMinPrice);
                  setMaxPrice(tempMaxPrice);
                  Keyboard.dismiss();
                }}
              >
                <LinearGradient
                  colors={["#059669", "#10B981", "#F59E0B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainBtn}
                >
                  <Ionicons name="filter" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.btnText}>APLICAR FILTROS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>
              Resultados ({filteredProducts.length})
            </Text>

            <View style={styles.productsGrid}>
              {visibleProducts.map((prod) => (
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
                        category: prod.category,
                        location: prod.location,
                        imageId: prod.imageId,
                      },
                    })
                  }
                >
                  <View style={styles.imageWrapper}>
                    {imageMap[prod.imageId] ? (
                      <Image
                        source={imageMap[prod.imageId]}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="image-outline" size={40} color="#A0AEC0" />
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

            {visibleCount < filteredProducts.length && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.loadMoreButton}
                onPress={() => setVisibleCount(visibleCount + 4)}
              >
                <Text style={styles.loadMoreText}>VER MÁS RESULTADOS</Text>
                <Ionicons name="chevron-down" size={16} color="#059669" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}

            {filteredProducts.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color="#F59E0B" />
                <Text style={styles.noResultsTitle}>No hay coincidencias</Text>
                <Text style={styles.noResultsText}>
                  Intenta ajustando el nombre o modificando el rango de precio seleccionado.
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#E0F7F1" },
  glowOrb: { position: "absolute", borderRadius: 150, opacity: 0.35 },
  orbTopLeft: { width: 260, height: 260, top: -50, left: -50, backgroundColor: "#10B981" },
  orbBottomRight: { width: 280, height: 280, bottom: -60, right: -50, backgroundColor: "#F59E0B" },
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "900", color: "#1F2937", letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#059669", fontWeight: "700", textAlign: "center" },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: "800", color: "#374151", letterSpacing: 1, marginBottom: 6 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchContainerFocused: { borderColor: "#10B981", shadowColor: "#10B981", shadowOpacity: 0.15, shadowRadius: 8 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#1F2937", fontWeight: "600" },
  categoriesContainer: { gap: 8, paddingVertical: 2 },
  categoryChip: { backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: "#E5E7EB" },
  categoryChipText: { fontSize: 13, fontWeight: "700", color: "#6B7280" },
  categoryChipSelected: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  categoryChipTextSelected: { fontSize: 13, fontWeight: "900", color: "#FFFFFF" },
  priceRangeContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 48,
    width: "44%",
  },
  priceCurrency: { fontSize: 13, fontWeight: "800", color: "#059669", marginRight: 4 },
  priceInput: { flex: 1, fontSize: 14, fontWeight: "700", color: "#1F2937" },
  priceSeparator: { fontSize: 16, fontWeight: "800", color: "#9CA3AF" },
  btnShadow: { shadowColor: "#10B981", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  mainBtn: { flexDirection: "row", height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  btnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", letterSpacing: 0.8 },
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
  imageWrapper: { width: "60%", height: 90, borderRadius: 14, overflow: "hidden", backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  productImage: { width: "100%", height: "100%" },
  productInfo: { paddingTop: 8, paddingHorizontal: 2 },
  productName: { fontSize: 14, fontWeight: "800", color: "#1F2937", marginBottom: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 4 },
  locationText: { fontSize: 11, color: "#059669", fontWeight: "600" },
  productPrice: { fontSize: 15, fontWeight: "900", color: "#D97706" },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  loadMoreText: { color: "#059669", fontWeight: "900", fontSize: 12, letterSpacing: 0.8 },
  noResultsContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 30 },
  noResultsTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937", marginTop: 10 },
  noResultsText: { fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 4, paddingHorizontal: 20 },
});