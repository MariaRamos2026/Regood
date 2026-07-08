import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Profile(){
    const router = useRouter();
    return (
        <View>
            <Text>Perfil</Text>
            <Button title="Cerrar sesión" onPress ={() =>router.replace('/(auth)/login')}/>
        </View>
    );
}