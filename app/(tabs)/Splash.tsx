import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.logo}>Regood</Text>
      <Text style={styles.title}>Bienvenido a Regood</Text>
      <Text style={styles.subtitle}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#f5f5f5',
  },
  logo: { fontSize: 48, fontWeight: 'bold', color: '#007AFF'},
  title: {fontSize: 24,fontWeight: 'bold',marginBottom: 10, color: '#333'},
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});