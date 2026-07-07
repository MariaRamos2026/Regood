import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

<Image 
  source={require('../assets/images/logosinfondo.png')} 
/>

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logosinfondo.png')} 
        style={styles.logoImage} 
      />

      <Text style={styles.logo}>Regood</Text>

      <Text style={styles.tagline}>
        Compra y vende artículos en buen estado, con seguridad garantizada
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.buttonPrimary} 
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSecondary} 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#F4F6F7' 
  },
  logoImage: { 
    width: 120, 
    height: 120, 
    marginBottom: 20 
  },
  logo: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#03273f', 
    marginBottom: 10
  },
  tagline: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginVertical: 20, 
    color: '#055727' 
  },
  buttons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%' 
  },
  buttonPrimary: { 
    backgroundColor: '#071d2c', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    marginHorizontal: 5 
  },
  buttonSecondary: { 
    backgroundColor: '#03642c', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    marginHorizontal: 5 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  }
});