import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Message = {
  id: string;
  sender: "yo" | "otro";
  text: string;
  type: "compra" | "venta"; 
};

export default function ChatScreen() {
  const router = useRouter();
  const { productName } = useLocalSearchParams();
  const safeProductName = typeof productName === "string" ? productName : "Producto";

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "otro", text: `Hola, ¿sigue disponible ${safeProductName}?`, type: "compra" },
    { id: "2", sender: "yo", text: "¡Hola! Sí, todavía está disponible 🔥", type: "venta" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const msg: Message = { 
      id: Date.now().toString(), 
      sender: "yo", 
      text: newMessage, 
      type: "venta" 
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{safeProductName}</Text>
          <Text style={styles.contactStatus}>En línea</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sender === "yo" ? styles.myMessage : styles.otherMessage,
            item.type === "compra" ? styles.compraMessage : styles.ventaMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e4fdf7" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#b8908a", padding: 15 },
  contactInfo: { marginLeft: 10, marginTop: 3 },
  contactName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  contactStatus: { color: "#fff", fontSize: 14 },
  messageBubble: { padding: 10, borderRadius: 8, marginVertical: 5, maxWidth: "75%" },
  myMessage: { alignSelf: "flex-end" },
  otherMessage: { alignSelf: "flex-start" },
  compraMessage: { backgroundColor: "#d0e8ff" }, // 🔹 azul para compras
  ventaMessage: { backgroundColor: "#ffe4b5" }, // 🔹 naranja para ventas
  messageText: { fontSize: 16, color: "#333" },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  sendButton: { backgroundColor: "#a5726a", borderRadius: 20, padding: 10, justifyContent: "center", alignItems: "center" },
});



