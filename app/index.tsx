import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "./services/authService";

export default function Index() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <Image 
          source={require("../assets/images/logosinfondo.png")} 
          style={styles.logoImage} 
        />
        <Text style={styles.subtitle}>Cargando...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center", 
    backgroundColor: "#D0F0E7", 
  },
  logoImage: { width: 300, height: 300, marginBottom: 50 }, 
  logo: { fontSize: 48, fontWeight: "bold", color: "#006D77" }, 
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#006D77" },
  subtitle: { fontSize: 16, color: "#006D77" },
});