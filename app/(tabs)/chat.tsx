import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  sender: "yo" | "otro";
  text: string;
  type: "compra" | "venta";
};

export default function ChatScreen() {
  const router = useRouter();
  const { productName, sharedLocation } = useLocalSearchParams();
  const safeProductName = typeof productName === "string" ? productName : "Producto";

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "otro", text: `Hola, ¿sigue disponible ${safeProductName}?`, type: "compra" },
    { id: "2", sender: "yo", text: "¡Hola! Sí, todavía está disponible ", type: "venta" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);


  useEffect(() => {
  const locationString =
    typeof sharedLocation === "string"
      ? sharedLocation
      : Array.isArray(sharedLocation)
      ? sharedLocation[0]
      : "";

  if (locationString.trim() !== "") {
    const msg: Message = {
      id: Date.now().toString(),
      sender: "yo",
      text: `📍 Ubicación compartida: ${locationString}`,
      type: "venta",
    };
    setMessages((prev) => [...prev, msg]);
  }
}, [sharedLocation]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: "yo",
      text: newMessage,
      type: "venta",
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

        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "yo" ? styles.myMessage : styles.otherMessage,
              item.type === "compra" ? styles.compraMessage : styles.ventaMessage,
            ]}
          >
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


      <Modal transparent visible={showMenu} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                router.push("/(tabs)/mapa"); 
              }}
            >
              <Ionicons name="location-outline" size={20} color="#04373b" />
              <Text style={styles.menuText}>Compartir ubicación</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
              <Ionicons name="close" size={20} color="#04373b" />
              <Text style={styles.menuText}>Cerrar menú</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e4fdf7" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#b8908a",
    padding: 15,
  },
  contactInfo: { flex: 1, marginLeft: 10 },
  contactName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  contactStatus: { color: "#fff", fontSize: 14 },
  messageBubble: { padding: 10, borderRadius: 8, marginVertical: 5, maxWidth: "75%" },
  myMessage: { alignSelf: "flex-end" },
  otherMessage: { alignSelf: "flex-start" },
  compraMessage: { backgroundColor: "#d0e8ff" },
  ventaMessage: { backgroundColor: "#ffe4b5" },
  messageText: { fontSize: 16, color: "#333" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#a5726a",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
    padding: 10,
    width: 180,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: { marginLeft: 10, fontSize: 16, color: "#04373b" },
});
