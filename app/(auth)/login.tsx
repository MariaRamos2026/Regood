import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { iniciarSesion } from '../services/authService';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Validar correo vacío
    if (!correo.trim()) {
      setErrorMessage("Por favor, ingresa tu correo electrónico.");
      return;
    }

    // Validar longitud de la contraseña (mínimo 8, máximo 16)
    if (password.length < 8 || password.length > 16) {
      setErrorMessage("La contraseña debe tener entre 8 y 16 caracteres.");
      return;
    }

    try {
      await iniciarSesion(correo.trim(), password);
      router.replace("/(tabs)/home");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("invalid-credential")) {
          setErrorMessage("Correo o contraseña incorrectos");
        } else {
          setErrorMessage("Ocurrió un problema al iniciar sesión");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia Sesión para continuar</Text>

      {/* Campo de Correo */}
      <TextInput 
        style={styles.input} 
        placeholder="Correo" 
        placeholderTextColor="#888"
        onChangeText={setCorreo} 
        value={correo} 
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      {/* Campo de Contraseña con Ojito */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputFlex} 
          placeholder="Contraseña (8 a 16 caracteres)" 
          placeholderTextColor="#888"
          secureTextEntry={!showPassword} 
          maxLength={16}
          onChangeText={setPassword} 
          value={password} 
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color={showPassword ? "#FF6F61" : "#04373b"}
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => router.push("/(auth)/recuperar")}>
        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
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

      {/* Modal de Error */}
      <Modal
        visible={!!errorMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorMessage('')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atención</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setErrorMessage('')}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontWeight: 'bold',
    color: "#04373b",
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 15, 
    color: "#04373b",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  forgot: {
    color: "#03353a",
    marginTop: 5,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: "right",
  }, 
  button: {
    backgroundColor: '#e4c1bc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#080808',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ca5045",
    marginBottom: 10
  },
  modalMessage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#b89690",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});