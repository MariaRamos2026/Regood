import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.replace("/login");
    }
  }, []);

  const menuItems = [
    {
      title: "Mis Publicaciones",
      icon: "pricetag-outline",
      route: "/publicaciones",
    },
    { title: "Favoritos", icon: "heart-outline", route: "/favoritos" },
    { title: "Mis Chats", icon: "chatbubble-outline", route: "/chat" },
    { title: "Mis datos", icon: "person-circle-outline", route: "/cuenta" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/configuracionapp")}
      >
        <Ionicons name="settings-outline" size={26} color="#04373b" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>

          
          <Ionicons name="person" size={50} color="#04373b" />
        </View>
        <Text style={styles.userName}>{user?.displayName || "Usuario"}</Text>
        <Text style={styles.userEmail}>{user?.email || "Sin email"}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={24} color="#04373b" />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#04373b"
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={26} color="#04373b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/buscar")}>
          <Ionicons name="search-outline" size={26} color="#04373b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/publicar")}>
          <Ionicons name="add-circle" size={40} color="#2ecc71" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/publicaciones")}>
          <Ionicons name="document-text-outline" size={26} color="#04373b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Ionicons name="person" size={26} color="#2ecc71" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9faf1", padding: 20 },

  settingsButton: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 10,
    padding: 5,
  },

  header: { alignItems: "center", marginTop: 60, marginBottom: 40 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  userName: { fontSize: 22, fontWeight: "bold", color: "#04373b" },
  userEmail: { fontSize: 16, color: "#666", marginTop: 5 },
  menuContainer: { flex: 1 },
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
