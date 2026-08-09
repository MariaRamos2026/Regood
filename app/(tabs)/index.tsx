import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      {/* Fondo de degradado fluido pastel Regood */}
      <LinearGradient
        colors={['#E0F7F1', '#E8FAEE', '#FFF0E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Orbes de luz decorativos */}
      <View style={[styles.glowOrb, styles.orbTopLeft]} />
      <View style={[styles.glowOrb, styles.orbBottomRight]} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* Header con Logo */}
          <View style={styles.header}>
            <View style={styles.logoBadgeShadow}>
              <Image
                source={require('../../assets/images/logosinfondo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Tarjeta Glassmorphism Contenedora */}
          <View style={styles.glassCard}>
            <Text style={styles.tagline}>
              Compra y vende artículos en buen estado, con seguridad garantizada
            </Text>

            {/* Botón Iniciar Sesión (Principal) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/(auth)/login')}
              style={styles.btnShadow}
            >
              <LinearGradient
                colors={['#059669', '#10B981', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.mainBtn}
              >
                <Text style={styles.primaryBtnText}>INICIAR SESIÓN</Text>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#059669" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botón Registrarse (Secundario) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(auth)/register')}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryBtnText}>REGISTRARSE</Text>
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
    backgroundColor: '#E0F7F1',
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 150,
    opacity: 0.35,
  },
  orbTopLeft: {
    width: 280,
    height: 280,
    top: -60,
    left: -60,
    backgroundColor: '#10B981',
  },
  orbBottomRight: {
    width: 300,
    height: 300,
    bottom: -70,
    right: -60,
    backgroundColor: '#F59E0B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadgeShadow: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
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
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 28,
  },
  btnShadow: {
    width: '100%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 14,
  },
  mainBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 10,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#10B981',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});