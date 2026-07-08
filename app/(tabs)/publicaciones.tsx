import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MisPublicacionesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("Activos");

  const products = [
    {
      id: "1",
      name: "Bicicleta Montaña",
      tag: "Como nuevo",
      price: 300,
      imageId: "bici",
      category: "Deportes",
      location: "Lima",
      status: "Activos",
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
    },
    {
      id: "5",
      name: "Mesa de centro",
      tag: null,
      price: 100,
      imageId: "mesa",
      category: "Hogar",
      location: "Lima",
      status: "Activos",
    },
    {
      id: "6",
      name: "Lavadora",
      tag: "Como nuevo",
      price: 800,
      imageId: "lavadora",
      category: "Hogar",
      location: "Lima",
      status: "Vendidos",
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

  const filteredData = products.filter((item) => item.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activos":
        return "#2ecc71";
      case "Vendidos":
        return "#ca5045";
      default:
        return "#888";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Publicaciones</Text>
      </View>

      <View style={styles.filterContainer}>
        {["Activos", "Vendidos", "Inactivos"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image
              source={imageMap[item.imageId]}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>S/. {item.price}</Text>
              <Text
                style={[
                  styles.productStatus,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#04373b", marginLeft: 15 },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  filterButtonActive: { backgroundColor: "#04373b" },
  filterText: { color: "#04373b", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    flexDirection: "row",
    elevation: 2,
  },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productInfo: { marginLeft: 15, justifyContent: "center" },
  productName: { fontSize: 16, fontWeight: "bold", color: "#04373b" },
  productPrice: { fontSize: 14, color: "#333", marginVertical: 4 },
  productStatus: { fontSize: 13, fontWeight: "bold" },
});
