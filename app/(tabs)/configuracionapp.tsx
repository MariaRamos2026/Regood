import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebaseConfig";

type MenuItem = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  isDestructive?: boolean;
  onPress?: () => void;
};

export default function ConfiguracionScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      title: "Notificaciones",
      icon: "notifications-outline",
      route: "/notificaciones",
    },
    {
      title: "Privacidad",
      icon: "lock-closed-outline",
      route: "/privacidad",
    },
    {
      title: "Ayuda",
      icon: "help-circle-outline",
      route: "/ayuda",
    },
    {
      title: "Cerrar Sesión",
      icon: "log-out-outline",
      isDestructive: true,
      onPress: handleSignOut,
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

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
        {/* Header Superior */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#059669" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Configuración</Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => {
              const handlePress = () => {
                if (item.onPress) {
                  item.onPress();
                } else if (item.route) {
                  router.push(item.route as any);
                }
              };

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    item.isDestructive && styles.destructiveCard,
                  ]}
                  onPress={handlePress}
                  activeOpacity={0.8}
                >
                  <View style={styles.menuLeft}>
                    <View
                      style={[
                        styles.iconCircle,
                        item.isDestructive
                          ? styles.destructiveIconCircle
                          : styles.standardIconCircle,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={item.isDestructive ? "#EF4444" : "#059669"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.menuText,
                        item.isDestructive && styles.destructiveText,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color={item.isDestructive ? "#EF4444" : "#9CA3AF"}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 15,
  },
  backButton: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  destructiveCard: {
    backgroundColor: "rgba(254, 242, 242, 0.85)",
    borderColor: "rgba(254, 226, 226, 0.95)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  standardIconCircle: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  destructiveIconCircle: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  menuText: {
    fontSize: 15,
    marginLeft: 14,
    color: "#1F2937",
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  destructiveText: {
    color: "#EF4444",
  },
});