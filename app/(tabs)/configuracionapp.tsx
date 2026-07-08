import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfiguracionScreen() {
  const router = useRouter();

  const menuItems = [
    { title: "Cuenta", icon: "person-outline" },
    { title: "Notificaciones", icon: "notifications-outline" },
    { title: "Privacidad", icon: "lock-closed-outline" },
    { title: "Ayuda", icon: "help-circle-outline" },
    { title: "Cerrar Sesión", icon: "log-out-outline", isDestructive: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => console.log(`Navegando a ${item.title}`)}
            >
              <View style={styles.menuLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.isDestructive ? "#ca5045" : "#04373b"}
                />
                <Text
                  style={[
                    styles.menuText,
                    item.isDestructive && { color: "#ca5045" },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#04373b"
              />
            </TouchableOpacity>
          ))}
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
  menuContainer: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#04373b",
    fontWeight: "600",
  },
});
