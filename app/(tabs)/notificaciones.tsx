import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const NotificationOption = ({
  icon,
  title,
  description,
  value,
  onValueChange,
}: NotificationOptionProps) => (
  <View style={styles.optionCard}>
    <View style={styles.optionLeft}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={20} color="#059669" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E5E7EB", true: "#10B981" }}
      thumbColor={Platform.OS === "ios" ? undefined : value ? "#FFFFFF" : "#F3F4F6"}
      ios_backgroundColor="#E5E7EB"
    />
  </View>
);

export default function NotificacionesScreen() {
  const router = useRouter();

  const [mensajes, setMensajes] = useState(true);
  const [publicaciones, setPublicaciones] = useState(false);
  const [seguridad, setSeguridad] = useState(true);

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
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#059669" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <NotificationOption
              icon="chatbubbles-outline"
              title="Nuevos mensajes"
              description="Recibe alertas cuando te envíen un mensaje en tus chats."
              value={mensajes}
              onValueChange={setMensajes}
            />

            <NotificationOption
              icon="pricetag-outline"
              title="Nuevas publicaciones"
              description="Avisos sobre productos recientes o novedades destacadas."
              value={publicaciones}
              onValueChange={setPublicaciones}
            />

            <NotificationOption
              icon="shield-checkmark-outline"
              title="Alertas de seguridad"
              description="Notificaciones importantes sobre el estado de tu cuenta."
              value={seguridad}
              onValueChange={setSeguridad}
            />
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
  sectionContainer: {
    marginTop: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 14,
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
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.2,
  },
  optionDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
    lineHeight: 16,
  },
});