import { Ionicons } from "@expo/vector-icons";
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
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#04373b"
        />
      </TouchableOpacity>

      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default function PrivacidadScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#d9faf1" />

      {/* Header con botón para regresar y título */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#04373b" />
        </TouchableOpacity>
        <Text style={styles.title}>Política de Privacidad</Text>
        <View style={{ width: 24 }} />
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
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#04373b",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 15,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#04373b",
    flex: 1,
    paddingRight: 8,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
    color: "#04373b",
  },
});