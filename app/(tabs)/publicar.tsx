import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert, Image, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useProducts } from "../Context/ProductsContext";

export default function PublicarScreen() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [imagen, setImagen] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Electrónica");
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublicar = () => {
    
    const nuevoProducto = {
      id: Date.now().toString(),
      name: titulo,
      tag: descripcion,
      price: Number(precio),
      imageId: "sofa", 
      category: categoria,
      location: "Lima",
      status: "Activos",
      imagen, 
    };

    addProduct(nuevoProducto); 

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.back();
    }, 2000);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita permiso para usar la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#04373b" />
          </TouchableOpacity>
          <Text style={styles.title}>Publicar un Producto</Text>
        </View>

        <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={{ width: "100%", height: "100%", borderRadius: 12 }} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={50} color="#04373b" />
              <Text style={styles.uploadText}>Subir foto</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
          <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
            <Text style={styles.optionText}>Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
            <Text style={styles.optionText}>Galería</Text>
          </TouchableOpacity>
        </View>

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
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => setCategoria(itemValue)}
            style={{height: 20}}
          >
            <Picker.Item label="Electrónica" value="Electrónica" />
            <Picker.Item label="Hogar" value="Hogar" />
            <Picker.Item label="Moda" value="Moda" />
            <Picker.Item label="Deportes" value="Deportes" />
            <Picker.Item label="Otros" value="Otros" />
          </Picker>
        </View>

        <Text style={styles.label}>Precio (S/.)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.publishButton} onPress={handlePublicar}>
          <Text style={styles.publishButtonText}>Publicar</Text>
        </TouchableOpacity>
      </ScrollView>

      {showSuccess && (
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={70} color="#2ecc71" />
            <Text style={styles.modalTitle}>¡Éxito!</Text>
            <Text style={styles.modalText}>Producto publicado correctamente</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 20 },
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
  label: { fontSize: 14, fontWeight: "bold", color: "#04373b", marginBottom: 5 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  publishButton: { backgroundColor: "#a17f7a", padding: 18, borderRadius: 12, alignItems: "center", marginTop: 20 },
  publishButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 20, padding: 30, alignItems: "center", elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#2ecc71", marginTop: 10 },
  modalText: { fontSize: 16, color: "#555", marginTop: 5, textAlign: "center" },
  optionButton: { backgroundColor: "#04373b", padding: 12, borderRadius: 8 },
  optionText: { color: "#fff", fontWeight: "bold" },
});

