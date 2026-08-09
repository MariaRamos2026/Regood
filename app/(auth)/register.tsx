import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registrarUsuario } from '../services/authService';

export default function RegisterScreen() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [color, setColor] = useState('#FF6F61');
  const router = useRouter();

  const handleRegister = async () => {
    // Validar campos vacíos
    if (!nombres.trim() || !apellidos.trim() || !email.trim() || !password.trim()) {
      setMensaje('Por favor, completa todos los campos');
      setColor('#eb9088');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmar) {
      setMensaje('Las contraseñas no coinciden');
      setColor('#eb9088');
      return;
    }

    try {
      const nombreCompleto = `${nombres.trim()} ${apellidos.trim()}`;
      // Llama al servicio de autenticación pasando el nombre completo, correo y contraseña
      await registrarUsuario(nombreCompleto, email.trim(), password);
      setMensaje('Registro exitoso');
      setColor('#006D77');

      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1500);
    } catch (error: any) {
      setMensaje('Error al registrar usuario');
      setColor('#eb9088');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Crear Cuenta</Text>

      {/* 1. Nombres */}
      <TextInput
        style={styles.input}
        placeholder="Nombres"
        placeholderTextColor="#888"
        value={nombres}
        onChangeText={setNombres}
      />

      {/* 2. Apellidos */}
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        placeholderTextColor="#888"
        value={apellidos}
        onChangeText={setApellidos}
      />

      {/* 3. Correo Electrónico */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* 4. Contraseña */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Contraseña"
          placeholderTextColor="#888"
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

      {/* 5. Confirmar contraseña */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#888"
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

      {/* Botón de Registro */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Enlace para Iniciar Sesión */}
      <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? <Text style={styles.boldText}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>

      {/* Banner de Mensaje */}
      {mensaje !== '' && (
        <View style={[styles.banner, { backgroundColor: color }]}>
          <Text style={styles.bannerText}>{mensaje}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
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
    backgroundColor: '#fff',
    fontSize: 15,
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
    paddingVertical: 12,
    fontSize: 15,
  },
  banner: { 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 20,
    alignSelf: 'stretch',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: { 
    marginTop: 20, 
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