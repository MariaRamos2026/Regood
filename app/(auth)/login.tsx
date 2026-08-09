import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { iniciarSesion } from '../services/authService';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isCorreoFocused, setIsCorreoFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!correo.trim()) {
      setErrorMessage("Por favor, ingresa tu correo electrónico.");
      return;
    }

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {/* Header / Brand */}
              <View style={styles.header}>
                <View style={styles.logoBadgeShadow}>
                  <Image
                    source={require('../../assets/images/logosinfondo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>¡Bienvenido!</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar en Regood</Text>
              </View>

              {/* Glassmorphism Card */}
              <View style={styles.glassCard}>
                {/* Campo Correo */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      isCorreoFocused && styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="mail"
                      size={18}
                      color={isCorreoFocused ? '#10B981' : '#F59E0B'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="ejemplo@correo.com"
                      placeholderTextColor="#A0AEC0"
                      onChangeText={setCorreo}
                      value={correo}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onFocus={() => setIsCorreoFocused(true)}
                      onBlur={() => setIsCorreoFocused(false)}
                    />
                  </View>
                </View>

                {/* Campo Contraseña */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CONTRASEÑA</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      isPasswordFocused && styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={18}
                      color={isPasswordFocused ? '#10B981' : '#F59E0B'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="8 a 16 caracteres"
                      placeholderTextColor="#A0AEC0"
                      secureTextEntry={!showPassword}
                      maxLength={16}
                      onChangeText={setPassword}
                      value={password}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#A0AEC0"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={() => router.push('/(auth)/recuperar')}>
                  <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Botón Principal Regood */}
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={handleLogin}
                  style={styles.btnShadow}
                >
                  <LinearGradient
                    colors={['#059669', '#10B981', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.mainBtn}
                  >
                    <Text style={styles.btnText}>INGRESAR</Text>
                    <View style={styles.arrowCircle}>
                      <Ionicons name="arrow-forward" size={16} color="#059669" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Enlace de Registro */}
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => router.push('/register')}
                activeOpacity={0.7}
              >
                <Text style={styles.registerText}>
                  ¿No tienes cuenta? <Text style={styles.registerHighlight}>Regístrate aquí</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Modal de Error */}
          <Modal
            visible={!!errorMessage}
            transparent
            animationType="fade"
            onRequestClose={() => setErrorMessage('')}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Ionicons name="alert-circle" size={42} color="#F59E0B" style={{ marginBottom: 12 }} />
                <Text style={styles.modalTitle}>Verifica tus datos</Text>
                <Text style={styles.modalMessage}>{errorMessage}</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.modalButton}
                  onPress={() => setErrorMessage('')}
                >
                  <Text style={styles.modalButtonText}>Entendido</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
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
    width: 260,
    height: 260,
    top: -50,
    left: -50,
    backgroundColor: '#10B981',
  },
  orbBottomRight: {
    width: 280,
    height: 280,
    bottom: -60,
    right: -50,
    backgroundColor: '#F59E0B',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadgeShadow: {
    width: 110,
    height: 110,
    marginBottom: 8,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  forgot: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 22,
  },
  btnShadow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  mainBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnText: {
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
  registerBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  registerHighlight: {
    color: '#059669',
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});