import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from './services/authService';

export default function Index() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.container}>
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

        {/* Contenido Principal */}
        <View style={styles.content}>
          <View style={styles.logoBadgeShadow}>
            <Image
              source={require('../assets/images/logosinfondo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Bienvenido a Regood</Text>
          <Text style={styles.subtitle}>Cargando experiencia...</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  logoBadgeShadow: {
    width: 150,
    height: 150,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '700',
  },
});