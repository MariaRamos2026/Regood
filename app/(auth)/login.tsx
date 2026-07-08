import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { iniciarSesion } from '../services/authService';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const uid = await iniciarSesion(correo, password);
       router.replace("/(tabs)/home");
    } catch (error) {
    if (error instanceof Error) {
    Alert.alert("Error al iniciar sesión", error.message);
  } 
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia Sesión para continuar</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Correo" 
        onChangeText={setCorreo} 
        value={correo} 
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input} 
        placeholder="Contraseña" 
        secureTextEntry 
        onChangeText={setPassword} 
        value={password} 
      />
      
      <TouchableOpacity onPress={() => router.push("/(auth)/forgotPassword")}>
        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerLink} 
        onPress={() => router.push('/register')}
      >
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.boldText}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: "#d9faf1",
    paddingTop: 20
  },
  title: {
    fontSize: 28,
    justifyContent: "flex-start",
    fontWeight: 'bold',
    color: "#04373b",
    marginBottom: 25,
    textAlign: 'center',
  },
  subtitle:{ 
    fontSize: 15, 
    color: "#04373b",
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
     marginBottom: 20 
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
    forgot: {
    color: "#03353a",
    marginTop: 25,
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
    textDecorationLine:
     "underline" 
  }, 
   button: {
    backgroundColor: '#e4c1bc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#080808',
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerText: {
    color: '#0e0e0e',
    fontSize: 15,
  },
  boldText: {
    color: '#006D77',
    fontWeight: 'bold',
  },
});