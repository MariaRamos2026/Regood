import { Text,View, Button} from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile(){
    const router = useRouter();
    return (
        <View>
            <Text>Perfil</Text>
            <Button title="Cerrar sesión" onPress ={() =>router.replace('/(auth)/login')}/>
        </View>
    );
}