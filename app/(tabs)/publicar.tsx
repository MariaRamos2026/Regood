import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PublicarScreen() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Electrónica");

  const handlePublicar = () => {
    // Aquí irá la lógica para subir a Firebase (Firestore + Storage)
    Alert.alert("Éxito", "Producto publicado correctamente");
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.title}>Publicar un Producto</Text>
      </View>

      {/* Cuadro de carga de foto */}
      <TouchableOpacity style={styles.imageUploadBox}>
        <Ionicons name="camera-outline" size={50} color="#04373b" />
        <Text style={styles.uploadText}>Subir foto</Text>
      </TouchableOpacity>

      {/* Inputs */}
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: iPhone 10"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Detalles del producto"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.input}>
        <Text>{categoria}</Text>
      </View>

      <Text style={styles.label}>Precio (S/.)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      {/* Botón Publicar */}
      <TouchableOpacity style={styles.publishButton} onPress={handlePublicar}>
        <Text style={styles.publishButtonText}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#04373b", marginLeft: 15 },
  imageUploadBox: {
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#04373b",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: { marginTop: 10, color: "#04373b", fontWeight: "bold" },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#04373b",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  publishButton: {
    backgroundColor: "#2ecc71",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  publishButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
