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
      Alert.alert("Acceso permitido", `Bienvenido, tu ID es: ${uid}`);
    } catch (error) {
    if (error instanceof Error) {
    Alert.alert("Error", error.message);
  } else {
    Alert.alert("Error", "Ocurrió un problema desconocido");
  }
}
  };

  return (
    <View style = {styles.container}>
      <TextInput 
      style= {styles.input} placeholder="Correo" onChangeText={setCorreo} value={correo} />
      <TextInput
      style= {styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} value={password} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
   button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});