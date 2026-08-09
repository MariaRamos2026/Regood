import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { app } from "../../app/config/firebaseConfig";

export default function DetalleProducto() {
  const router = useRouter();
  const { name, price, description, location, imageId } = useLocalSearchParams();
  const db = getFirestore(app);

  const [favorito, setFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState<string | null>(null);

  // Descripción predeterminada cuando la descripción recibida sea nula o vacía
  const defaultDescription = `Producto en excelente estado, disponible para entrega inmediata. Garantía de autenticidad e inspección previa al intercambio.`;

  const descripcionFinal =
    description && typeof description === "string" && description.trim() !== "" && description !== "Sin descripción"
      ? description
      : defaultDescription;

  // Verificar si ya está en favoritos
  useEffect(() => {
    const verificarFavorito = async () => {
      if (!name) return;
      const q = query(collection(db, "favoritos"), where("producto", "==", name));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setFavorito(true);
        setFavoritoId(snapshot.docs[0].id);
      }
    };
    verificarFavorito();
  }, [name]);

  // Toggle favorito
  const toggleFavorito = async () => {
    try {
      if (favorito && favoritoId) {
        await deleteDoc(doc(db, "favoritos", favoritoId));
        setFavorito(false);
        setFavoritoId(null);
      } else {
        const docRef = await addDoc(collection(db, "favoritos"), {
          producto: name,
          precio: price,
          descripcion: descripcionFinal,
          ubicacion: location || "Ubicación no disponible",
          imageId: imageId,
          fecha: serverTimestamp(),
        });
        setFavorito(true);
        setFavoritoId(docRef.id);
      }
    } catch (error) {
      console.log("Error al manejar favorito:", error);
    }
  };

  // Resolver imagen
  const imageMap: Record<string, any> = {
    bici: require('../../assets/images/bici.png'),
    reloj: require('../../assets/images/reloj.png'),
    iphone: require('../../assets/images/iphone.png'),
    zapatillas: require('../../assets/images/zapatillas.png'),
    mesa: require('../../assets/images/mesa.png'),
    lavadora: require('../../assets/images/lavadora.png'),
    sofa: require('../../assets/images/sofa.png'),
    lampara: require('../../assets/images/lampara.png'),
    pelota: require('../../assets/images/pelota.webp'),
    silla: require('../../assets/images/silla.png'),
  };

  let resolvedImage: any = null;
  if (imageId) {
    if (typeof imageId === "string" && imageMap[imageId]) {
      resolvedImage = imageMap[imageId];
    } else {
      resolvedImage = imageId;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#E0F7F1', '#E8FAEE', '#FFF0E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.glowOrb, styles.orbTopLeft]} />
      <View style={[styles.glowOrb, styles.orbBottomRight]} />

      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#059669" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageCard}>
            {resolvedImage ? (
              <Image source={resolvedImage} style={styles.productImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={54} color="#A0AEC0" />
                <Text style={styles.placeholderText}>Sin imagen disponible</Text>
              </View>
            )}

            <View style={styles.locationBadge}>
              <Ionicons name="location-sharp" size={14} color="#059669" />
              <Text style={styles.locationBadgeText}>
                {location || "Ubicación no disponible"}
              </Text>
            </View>
          </View>

          <View style={styles.glassCard}>
            <View style={styles.nameRow}>
              <Text style={styles.productName}>{name}</Text>
              <TouchableOpacity
                onPress={toggleFavorito}
                activeOpacity={0.8}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorito ? "heart" : "heart-outline"}
                  size={24}
                  color={favorito ? "#EF4444" : "#059669"}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.productPrice}>S/ {price}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
            <Text style={styles.productDescription}>
              {descripcionFinal}
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.btnShadow}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: { productName: name },
                })
              }
            >
              <LinearGradient
                colors={['#059669', '#10B981', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.mainBtn}
              >
                <Ionicons name="chatbubbles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.btnText}>INICIAR CHAT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E0F7F1' },
  glowOrb: { position: 'absolute', borderRadius: 150, opacity: 0.35 },
  orbTopLeft: { width: 260, height: 260, top: -50, left: -50, backgroundColor: '#10B981' },
  orbBottomRight: { width: 280, height: 280, bottom: -60, right: -50, backgroundColor: '#F59E0B' },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 65, paddingBottom: 30 },
  imageCard: {
    position: 'relative',
    width: '100%',
    height: 260,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  productImage: { width: '60%', height: '90%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  placeholderText: { color: '#A0AEC0', fontSize: 13, fontWeight: '600', marginTop: 6 },
  locationBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationBadgeText: { fontSize: 12, fontWeight: '700', color: '#059669', marginLeft: 4 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  productName: { flex: 1, fontSize: 22, fontWeight: '900', color: '#1F2937', letterSpacing: -0.5, marginRight: 10 },
  favoriteButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productPrice: { fontSize: 24, fontWeight: '900', color: '#D97706', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 14 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#374151', letterSpacing: 1, marginBottom: 8 },
  productDescription: { fontSize: 14, color: '#4B5563', lineHeight: 22, fontWeight: '500', marginBottom: 24 },
  btnShadow: { shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 6 },
  mainBtn: { flexDirection: 'row', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  btnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.8 },
});




