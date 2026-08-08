import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConversacionesScreen() {
  const router = useRouter();
  const [conversaciones, setConversaciones] = useState([
    { id: "1", producto: "Televisor Hyundai", ultimoMensaje: "Hola!" },
    { id: "2", producto: "Refrigerador LG", ultimoMensaje: "¿Disponible?" },
    { id: "3", producto: "Licuadora Oster", ultimoMensaje: "Buen estado?" },
  ]);

  const eliminarConversacion = (id: string) => {
    setConversaciones(conversaciones.filter((c) => c.id !== id));
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: { conversacionId: item.id, productName: item.producto },
          })
        }
      >
        <Text style={styles.producto}>{item.producto}</Text>
        <Text style={styles.ultimoMensaje}>{item.ultimoMensaje}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => eliminarConversacion(item.id)}>
        <Ionicons name="trash" size={22} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con botón volver */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.header}>Mis Conversaciones 💬</Text>
      </View>

      <FlatList
        data={conversaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40, 
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  header: { fontSize: 22, fontWeight: "bold", color: "#04373b" },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  producto: { fontSize: 16, fontWeight: "600", color: "#04373b" },
  ultimoMensaje: { fontSize: 14, color: "#666" },
});
