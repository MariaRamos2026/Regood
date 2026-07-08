import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

export default function MapaScreen() {
  const [location, setLocation] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
  });
  const [address, setAddress] = useState("Ubicación actual");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa los permisos de ubicación para continuar.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const [place] = await Location.reverseGeocodeAsync(currentLocation.coords);
      const fullAddress = `${place.name || "Punto"} - ${place.city}, ${place.region}`;
      setAddress(fullAddress);

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        router.replace({
          pathname: "/(tabs)/chat", 
          params: { sharedLocation: fullAddress },
        });
      }, 2500);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación. Verifica que el GPS esté encendido.");
      console.error(error);
    }
  };


  const handleMapPress = async (event: MapPressEvent) => {
    const coords = event.nativeEvent.coordinate;
    setLocation(coords);

    const [place] = await Location.reverseGeocodeAsync(coords);
    const fullAddress = `${place.name || "Punto"} - ${place.city}, ${place.region}`;
    setAddress(fullAddress);

    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      router.replace({
        pathname: "/(tabs)/chat",
        params: { sharedLocation: fullAddress },
      });
    }, 2500);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Compartir punto de encuentro</Text>
      <Text style={styles.subtitle}>Selecciona o comparte un punto de encuentro</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={location} title="Punto de encuentro" />
        </MapView>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.address}>{address}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetLocation}>
        <Text style={styles.buttonText}>📍 Compartir ubicación</Text>
      </TouchableOpacity>


      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={60} color="#2e7d32" />
            <Text style={styles.modalTitle}>Ubicación compartida</Text>
            <Text style={styles.modalText}>
              Tu ubicación ha sido enviada correctamente 💫
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9faf1",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
   
    alignSelf: "flex-start",
    backgroundColor: "#b8948e",
    borderRadius: 20,
    padding: 8,
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#04373b", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 15 },
  mapContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    overflow: "hidden",
    width: "90%",
    height: 300,
    marginBottom: 15,
  },
  map: { flex: 1 },
  infoBox: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    marginBottom: 15,
  },
  address: { fontSize: 14, color: "#333", textAlign: "center" },
  button: {
    backgroundColor: "#b8948e",
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#04373b",
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
});

