import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const handlePublicar = () => {
    if (!titulo.trim() || !precio.trim()) {
      Alert.alert("Campos requeridos", "Por favor ingresa al menos un título y un precio.");
      return;
    }

    const nuevoProducto = {
      id: Date.now().toString(),
      name: titulo,
      tag: descripcion || "Excelente estado",
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        {/* Fondo con degradado fluido pastel Regood */}
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Publicar Producto 🛍️</Text>
              <Text style={styles.subtitle}>
                Dale una segunda vida a tus artículos sostenibles
              </Text>
            </View>

            {/* Selector e Imagen del Producto */}
            <View style={styles.glassCard}>
              <TouchableOpacity
                style={styles.imageUploadBox}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {imagen ? (
                  <Image source={{ uri: imagen }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="camera-outline" size={48} color="#059669" />
                    <Text style={styles.uploadText}>Cargar foto del producto</Text>
                    <Text style={styles.uploadSubtext}>Toca para explorar galería</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Botones de selección rápida de foto */}
              <View style={styles.photoOptionsRow}>
                <TouchableOpacity
                  style={styles.photoOptionBtn}
                  onPress={takePhoto}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera" size={16} color="#059669" style={{ marginRight: 6 }} />
                  <Text style={styles.photoOptionText}>Cámara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoOptionBtn}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="images" size={16} color="#059669" style={{ marginRight: 6 }} />
                  <Text style={styles.photoOptionText}>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Formulario de Datos */}
            <View style={styles.glassCard}>
              {/* Campo: Título */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TÍTULO DEL PRODUCTO</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isTitleFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="text-outline"
                    size={18}
                    color={isTitleFocused ? "#10B981" : "#A0AEC0"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: iPhone 10"
                    placeholderTextColor="#A0AEC0"
                    value={titulo}
                    onChangeText={setTitulo}
                    onFocus={() => setIsTitleFocused(true)}
                    onBlur={() => setIsTitleFocused(false)}
                  />
                </View>
              </View>

              {/* Campo: Descripción */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DESCRIPCIÓN</Text>
                <View
                  style={[
                    styles.inputContainer,
                    styles.multilineContainer,
                    isDescFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={isDescFocused ? "#10B981" : "#A0AEC0"}
                    style={[styles.inputIcon, { marginTop: 12 }]}
                  />
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    placeholder="Describe los detalles, estado y características..."
                    placeholderTextColor="#A0AEC0"
                    value={descripcion}
                    onChangeText={setDescripcion}
                    multiline
                    numberOfLines={3}
                    onFocus={() => setIsDescFocused(true)}
                    onBlur={() => setIsDescFocused(false)}
                  />
                </View>
              </View>

              {/* Campo: Categoría */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CATEGORÍA</Text>
                <View style={styles.pickerWrapper}>
                  <Ionicons
                    name="grid-outline"
                    size={18}
                    color="#059669"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={categoria}
                    onValueChange={(itemValue) => setCategoria(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Electrónica" value="Electrónica" />
                    <Picker.Item label="Hogar" value="Hogar" />
                    <Picker.Item label="Moda" value="Moda" />
                    <Picker.Item label="Deportes" value="Deportes" />
                    <Picker.Item label="Otros" value="Otros" />
                  </Picker>
                </View>
              </View>

              {/* Campo: Precio */}
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.label}>PRECIO (S/)</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isPriceFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Text style={styles.currencyPrefix}>S/</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0.00"
                    placeholderTextColor="#A0AEC0"
                    value={precio}
                    onChangeText={setPrecio}
                    keyboardType="numeric"
                    onFocus={() => setIsPriceFocused(true)}
                    onBlur={() => setIsPriceFocused(false)}
                  />
                </View>
              </View>

              {/* Botón Publicar */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.btnShadow}
                onPress={handlePublicar}
              >
                <LinearGradient
                  colors={["#059669", "#10B981", "#F59E0B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainBtn}
                >
                  <Ionicons
                    name="cloud-upload"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.btnText}>PUBLICAR PRODUCTO</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Modal / Overlay de Éxito */}
        {showSuccess && (
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.modalTitle}>¡Producto Publicado!</Text>
              <Text style={styles.modalText}>
                Tu producto ya se encuentra activo en el catálogo de Regood.
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 20,
  },
  imageUploadBox: {
    height: 180,
    width: "100%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
    backgroundColor: "rgba(240, 253, 244, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },
  uploadSubtext: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 2,
  },
  photoOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  photoOptionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  photoOptionText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#059669",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#374151",
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputContainer: {
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
  inputContainerFocused: {
    borderColor: "#10B981",
    shadowColor: "#10B981",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  multilineContainer: {
    height: 90,
    alignItems: "flex-start",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingTop: 10,
    height: "100%",
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: "800",
    color: "#059669",
    marginRight: 8,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingLeft: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  picker: {
    flex: 1,
    color: "#1F2937",
  },
  btnShadow: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  mainBtn: {
    flexDirection: "row",
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    width: "80%",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 12,
  },
  modalText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 18,
  },
});
