import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registrarUsuario } from '../services/authService';

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [color, setColor] = useState('#FF6F61');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmar) {
      setMensaje('Las contraseñas no coinciden');
      setColor('#eb9088');
      return;
    }

    try {
      const uid = await registrarUsuario(nombre, email, password);
      setMensaje('Registro exitoso');
      setColor('#006D77');

      setTimeout(() => {
          router.replace('/(tabs)/home');
      }, 2000);
    
    } catch (error: any) {
      setMensaje('Error al registrar usuario');
      setColor('#eb9088');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color={showPassword ? "#FF6F61" : "#04373b"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Confirmar contraseña"
          secureTextEntry={!confirmShowPassword}
          value={confirmar}
          onChangeText={setConfirmar}
        />
        <TouchableOpacity onPress={() => setConfirmShowPassword(!confirmShowPassword)}>
          <Ionicons
            name={confirmShowPassword ? "eye-off" : "eye"}
            size={22}
            color={confirmShowPassword ? "#FF6F61" : "#04373b"}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? <Text style={styles.boldText}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>

      {mensaje !== '' && (
        <View style={[styles.banner, { backgroundColor: color }]}>
          <Text style={styles.bannerText}>{mensaje}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 25, 
    backgroundColor: '#d9faf1' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: "#04373b", 
    marginBottom: 25, 
    textAlign: 'center' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#CCC', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  inputContainer: {
    flexDirection: 'row',       
    alignItems: 'center',       
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputFlex: { 
    flex: 1, 
    paddingVertical: 12 
  },
  banner: { 
    padding: 10, 
    borderRadius: 8, 
    position: "absolute", 
    bottom: 50, left: 20, 
    right: 20 
  },
  bannerText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#e4c1bc', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#080808', 
    fontWeight: 'bold' 
  },
  loginLink: { 
    marginTop: 25, 
    alignItems: 'center' 
  },
  loginText: { 
    color: '#0e0e0e', 
    fontSize: 15 
  },
  boldText: { 
    color: '#0e0e0e', 
    fontWeight: 'bold' 
  }
});
