import { Image, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/logosinfondo.png')}
        style={styles.reactLogo}
      />


      <Text style={styles.title}>Regood</Text>


      <Text style={styles.tagline}>
        Compra y vende artículos en buen estado, con seguridad garantizada
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F4F6F7', 
    padding: 20 
  },
  reactLogo: { 
    width: 120, 
    height: 120, 
    marginBottom: 20, 
    resizeMode: 'contain' 
  },
  title: { 
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
  }
});

