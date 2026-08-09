import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificacionesScreen() {
  const router = useRouter();

  const [mensajes, setMensajes] = useState(true);
  const [publicaciones, setPublicaciones] = useState(false);
  const [seguridad, setSeguridad] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView>
        <View style={styles.option}>
          <Text style={styles.optionText}>Nuevos mensajes</Text>
          <Switch value={mensajes} onValueChange={setMensajes} />
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Nuevas publicaciones</Text>
          <Switch value={publicaciones} onValueChange={setPublicaciones} />
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Alertas de seguridad</Text>
          <Switch value={seguridad} onValueChange={setSeguridad} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 30,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#04373b" },
  backButton: { padding: 5 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  optionText: { fontSize: 16, color: "#04373b", fontWeight: "600" },
});
