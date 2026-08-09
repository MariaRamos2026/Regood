import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getAuth, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../config/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("Usuario");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);

      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(
              data.nombre ||
                `${data.nombres || ""} ${data.apellidos || ""}`.trim() ||
                currentUser.displayName ||
                currentUser.email ||
                "Usuario"
            );
          } else {
            setUserName(currentUser.displayName || currentUser.email || "Usuario");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      router.replace("/login");
    }
  }, []);

  const menuItems = [
    { title: "Mis Publicaciones", icon: "pricetag-outline", route: "/publicaciones" },
    { title: "Favoritos", icon: "heart-outline", route: "/favoritos" },
    { title: "Mis Chats", icon: "chatbubble-outline", route: "/conversaciones" },
    { title: "Mis datos", icon: "person-circle-outline", route: "/cuenta" },
  ];

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
        {/* Botón de configuración superior */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/configuracionapp")}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color="#059669" />
        </TouchableOpacity>

        {/* Encabezado del Perfil */}
        <View style={styles.header}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color="#10B981" />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#059669" style={{ marginTop: 15 }} />
          ) : (
            <>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{user?.email || "Sin email registrado"}</Text>
            </>
          )}
        </View>

        {/* Opciones de Menú */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={item.icon as any} size={20} color="#059669" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Barra de navegación inferior */}
        <View style={styles.navbarContainer}>
          <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push("/home")} activeOpacity={0.7}>
              <Ionicons name="home-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/buscar")} activeOpacity={0.7}>
              <Ionicons name="search-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/publicar")}
              activeOpacity={0.8}
              style={styles.addButton}
            >
              <LinearGradient
                colors={["#059669", "#10B981"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/publicaciones")} activeOpacity={0.7}>
              <Ionicons name="document-text-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/perfil")} activeOpacity={0.7}>
              <Ionicons name="person" size={24} color="#059669" />
            </TouchableOpacity>
          </View>
        </View>
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
  settingsButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 20,
    right: 20,
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
    marginTop: 50,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 55,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: "#E8FAEE",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.5,
    marginTop: 14,
  },
  userEmail: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "700",
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    marginLeft: 14,
    color: "#1F2937",
    fontWeight: "800",
  },
  navbarContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 16,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  addButton: {
    marginTop: -22,
  },
  addButtonGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
