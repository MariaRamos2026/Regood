import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product, useProducts } from "../Context/ProductsContext";

export default function MisPublicacionesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("Activos");
  const { products } = useProducts();

  const productsEjemplo: Product[] = [
    {
      id: "1",
      name: "Bicicleta Montaña",
      tag: "Como nuevo",
      price: 300,
      imageId: "bici",
      category: "Deportes",
      location: "Lima",
      status: "Activos",
      imagen: null,
      descripcion: "Bicicleta de montaña resistente con frenos de disco y cambios de 21 velocidades."
    },
    {
      id: "2",
      name: "Smart Watch",
      tag: "Gran Oferta",
      price: 200,
      imageId: "reloj",
      category: "Electrónica",
      location: "Lima",
      status: "Activos",
      imagen: null,
      descripcion: "Reloj inteligente con monitor de ritmo cardíaco y llamadas Bluetooth."
    },
    {
      id: "3",
      name: "iPhone 10",
      tag: null,
      price: 750,
      imageId: "iphone",
      category: "Electrónica",
      location: "Callao",
      status: "Vendidos",
      imagen: null,
      descripcion: "iPhone X de 64 GB en excelente estado con pantalla Super Retina OLED."
    },
    {
      id: "4",
      name: "Zapatillas Nike",
      tag: null,
      price: 50,
      imageId: "zapatillas",
      category: "Moda",
      location: "Cusco",
      status: "Inactivos",
      imagen: null,
      descripcion: "Zapatillas deportivas superligeras y cómodas, talla 41."
    },
  ];

  const allProducts: Product[] = [...productsEjemplo, ...products];

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

  const filteredData = allProducts.filter((item) => item.status === filter);

  const getStatusBadgeConfig = (status: string) => {
    switch (status) {
      case "Activos":
        return { bg: "rgba(16, 185, 129, 0.12)", color: "#059669", icon: "checkmark-circle-outline" };
      case "Vendidos":
        return { bg: "rgba(239, 68, 68, 0.12)", color: "#EF4444", icon: "cart-outline" };
      default:
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#6B7280", icon: "pause-circle-outline" };
    }
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
          <Text style={styles.title}>Mis Publicaciones 📦</Text>
          <Text style={styles.subtitle}>
            Gestiona el estado de tus productos publicados
          </Text>
        </View>

        {/* Filtros de Pestaña */}
        <View style={styles.filterContainer}>
          {["Activos", "Vendidos", "Inactivos"].map((f) => {
            const isSelected = filter === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.8}
                onPress={() => setFilter(f)}
                style={styles.filterTab}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={["#059669", "#10B981"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterButtonActive}
                  >
                    <Text style={styles.filterTextActive}>{f}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterButton}>
                    <Text style={styles.filterText}>{f}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lista de Publicaciones */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const badge = getStatusBadgeConfig(item.status);

            // Soporte para ambas claves de descripción (description o descripcion)
            const itemDescripcion =
              item.descripcion ||
              (item as any).descripcion ||
              item.tag ||
              "Producto publicado en Regood listo para entrega.";

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.productCard}
                onPress={() =>
                  router.push({
                    pathname: "/detalleproducto",
                    params: {
                      name: item.name,
                      price: item.price,
                      description: itemDescripcion,
                      location: item.location || "Lima",
                      imageId: item.imageId,
                    },
                  })
                }
              >
                <View style={styles.imageWrapper}>
                  {item.imagen ? (
                    <Image source={{ uri: item.imagen }} style={styles.productImage} />
                  ) : item.imageId && imageMap[item.imageId] ? (
                    <Image source={imageMap[item.imageId]} style={styles.productImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={32} color="#A0AEC0" />
                    </View>
                  )}
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>S/ {item.price}</Text>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={12} color={badge.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#A0AEC0" style={styles.arrowIcon} />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={54} color="#F59E0B" />
              <Text style={styles.emptyTitle}>Sin productos</Text>
              <Text style={styles.emptyText}>
                No tienes productos registrados en la sección "{filter}".
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
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "700",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  filterButtonActive: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },
  filterTextActive: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 22,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "#D97706",
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  arrowIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
