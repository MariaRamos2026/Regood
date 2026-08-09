import { Ionicons } from "@expo/vector-icons";
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
        <Text style={styles.accordionTitle}>• {title}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#003e36"
        />
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#d9faf1" />

      {/* Header con botón para regresar y título */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButtonHeader}
        >
          <Ionicons name="arrow-back" size={24} color="#003e36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Preguntas Frecuentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>

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
            content="ve a 'Configuración' desde tu perfil y selecciona 'Cerrar sesión'."
          />
        </View>

        {/* Contacto de Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto de Soporte</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={enviarCorreoSoporte}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Enviar correo a soporte</Text>
          </TouchableOpacity>
        </View>

        {/* Seguridad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>

          <AccordionItem
            title="Nunca compartas tu contraseña con nadie."
            content="Nuestro equipo de soporte nunca te pedirá tu contraseña. Mantén tus credenciales de acceso de forma confidencial y segura."
          />
          <AccordionItem
            title="Revisa siempre las políticas de privacidad."
            content="Te recomendamos leer nuestros términos de servicio y políticas de privacidad para conocer cómo protegemos tus datos e información."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9faf1",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButtonHeader: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003e36",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003e36",
    marginBottom: 12,
  },
  accordionContainer: {
    marginBottom: 8,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  accordionTitle: {
    fontSize: 15,
    color: "#333333",
    flex: 1,
    paddingRight: 10,
  },
  accordionContent: {
    paddingLeft: 14,
    paddingTop: 4,
    paddingBottom: 8,
  },
  accordionText: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});