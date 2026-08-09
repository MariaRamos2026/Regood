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
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AccordionSectionProps = {
  title: string;
  children: React.ReactNode;
};

// Componente reusable para las secciones desplegables
const AccordionSection = ({ title, children }: AccordionSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.iconCircle}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#059669"
          />
        </View>
      </TouchableOpacity>

      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default function PrivacidadScreen() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Política de Privacidad</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Contenido de las Políticas de Privacidad */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.introText}>
            En nuestra plataforma valoramos y respetamos tu privacidad. Toca cada
            sección para desglosar la información detallada.
          </Text>

          {/* Sección 1 */}
          <AccordionSection title="1. Información que Recopilamos">
            <Text style={styles.paragraph}>
              • <Text style={styles.boldText}>Datos de Registro:</Text> Nombre,
              apellidos, correo electrónico y número de teléfono proporcionados al
              crear tu cuenta.
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.boldText}>Datos de Publicaciones:</Text>{" "}
              Información, imágenes y descripciones de los productos que subes a
              la plataforma.
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.boldText}>Ubicación:</Text> Datos de ubicación
              únicamente cuando decides compartirla dentro del chat para facilitar
              la entrega de un producto.
            </Text>
          </AccordionSection>

          {/* Sección 2 */}
          <AccordionSection title="2. Uso de la Información">
            <Text style={styles.paragraph}>
              Utilizamos tus datos exclusivamente para:
            </Text>
            <Text style={styles.paragraph}>
              • Permitir la comunicación mediante el chat integrado entre
              usuarios.
            </Text>
            <Text style={styles.paragraph}>
              • Gestionar tus publicaciones, productos favoritos y preferencias.
            </Text>
            <Text style={styles.paragraph}>
              • Verificar la autenticidad de los usuarios y garantizar un entorno
              seguro.
            </Text>
          </AccordionSection>

          {/* Sección 3 */}
          <AccordionSection title="3. Protección y Almacenamiento">
            <Text style={styles.paragraph}>
              Tus datos se almacenan de manera segura utilizando infraestructura
              de servicios en la nube (Firebase/Google Cloud Platform) con
              protocolos de cifrado de extremo a extremo para evitar accesos no
              autorizados.
            </Text>
          </AccordionSection>

          {/* Sección 4 */}
          <AccordionSection title="4. Derechos del Usuario (ARCO)">
            <Text style={styles.paragraph}>
              Cumplimos con la{" "}
              <Text style={styles.boldText}>
                Ley de Protección de Datos Personales (Ley N.º 29733)
              </Text>
              . Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al
              tratamiento de tus datos personales.
            </Text>
            <Text style={styles.paragraph}>
              Puedes solicitar la modificación o eliminación total de tus datos
              directamente en la sección "Mis datos" o enviando un mensaje a
              nuestro equipo de Soporte.
            </Text>
          </AccordionSection>

          {/* Sección 5 */}
          <AccordionSection title="5. Consentimiento y Cambios">
            <Text style={styles.paragraph}>
              Al utilizar esta aplicación, aceptas los términos de esta política de
              privacidad. Nos reservamos el derecho de actualizar este documento
              para adaptarlo a novedades legislativas o mejoras en la aplicación.
            </Text>
          </AccordionSection>
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
    paddingBottom: 40,
  },
  introText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 16,
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
    flex: 1,
    paddingRight: 8,
    letterSpacing: -0.2,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.6)",
    paddingTop: 12,
  },
  paragraph: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: "500",
  },
  boldText: {
    fontWeight: "800",
    color: "#059669",
  },
});