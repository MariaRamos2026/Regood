import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Regood</Text>
      <Text style={styles.tagline}>
        Compra y vende artículos en buen estado, con seguridad garantizada
      </Text>
      <View style={styles.buttons}>
        <Button 
          title="Registrarse" 
          onPress={() => router.push('/(auth)/register')} 
        />
        <Button 
          title="Iniciar sesión" 
          onPress={() => router.push('/(auth)/login')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#2E86C1' },
  tagline: { fontSize: 16, textAlign: 'center', marginVertical: 20, color: '#27AE60' },
  buttons: { flexDirection: 'row', gap: 10 }
});
