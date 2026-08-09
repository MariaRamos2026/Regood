import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AccordionItemProps = {
  title: string;
  content: string;
};

// Componente reusable para los ítems desplegables
const AccordionItem = ({ title, content }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <View style={styles.iconCircle}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#059669"
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

export default function AyudaScreen() {
  const router = useRouter();

  const enviarCorreoSoporte = async () => {
    const destinatario = "ramosvarelamaria674@gmail.com";
    const asunto = "Soporte App - Consulta";
    const cuerpo = "Hola equipo de soporte, necesito ayuda con...";
    const url = `mailto:${destinatario}?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpo)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Cliente de correo no disponible",
          `No se encontró una aplicación de correo predeterminada. Puedes escribirnos a: ${destinatario}`,
          [{ text: "Entendido" }]
        );
      }
    } catch (error) {
      console.error("Error al intentar abrir el correo:", error);
      Alert.alert(
        "Error",
        "Ocurrió un problema al intentar abrir la aplicación de correo."
      );
    }
  };

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
            style={styles.backButtonHeader}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#059669" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Centro de Ayuda</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Preguntas Frecuentes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
            <View style={styles.cardGroup}>
              <AccordionItem
                title="¿Cómo edito mi perfil?"
                content="Ve a la pestaña de 'Mi Cuenta', presiona 'Mis datos' y luego el botón 'Editar' en la parte superior para modificar tu información personal."
              />
              <AccordionItem
                title="¿Cómo publico un producto?"
                content="Presiona el botón '+' en la barra de navegación inferior, completa el formulario con la información e imágenes del producto y pulsa 'Publicar'."
              />
              <AccordionItem
                title="¿Cómo uso los chats?"
                content="Puedes iniciar una conversación directa desde el detalle de cualquier producto. Todas tus conversaciones activas se guardan en la sección 'Mis Chats'."
              />
              <AccordionItem
                title="¿Cómo cierro sesión?"
                content="Ve a 'Configuración' desde tu perfil y selecciona 'Cerrar sesión'."
              />
            </View>
          </View>

          {/* Contacto de Soporte */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto de Soporte</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={enviarCorreoSoporte}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#059669", "#10B981"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="mail-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Enviar correo a soporte</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Seguridad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seguridad</Text>
            <View style={styles.cardGroup}>
              <AccordionItem
                title="Nunca compartas tu contraseña con nadie."
                content="Nuestro equipo de soporte nunca te pedirá tu contraseña. Mantén tus credenciales de acceso de forma confidencial y segura."
              />
              <AccordionItem
                title="Revisa siempre las políticas de privacidad."
                content="Te recomendamos leer nuestros términos de servicio y políticas de privacidad para conocer cómo protegemos tus datos e información."
              />
            </View>
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
  backButtonHeader: {
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
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  cardGroup: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 22,
    padding: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  accordionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    paddingRight: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  accordionContent: {
    paddingBottom: 12,
    paddingRight: 10,
  },
  accordionText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    fontWeight: "500",
  },
  button: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 10,
  },
});