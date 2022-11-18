import { VStack, Image, Text, Center, Heading, ScrollView} from 'native-base';

import LogoSvg from '../assets/logo.svg';
import BackGroundImg from '../assets/background.png'

import { Input } from '../components/Input';    
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export function SignUp(){

    const navigation = useNavigation();

    function handleGoBack(){
        navigation.goBack();
    }

    return (
        <ScrollView 
            contentContainerStyle={{flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1}  px={10}>
                <Image 
                    source={BackGroundImg} 
                    defaultSource={BackGroundImg}
                    alt="People Training"    
                    resizeMode="contain" 
                    position="absolute"
                />

                <Center my={24}>

                    <LogoSvg/>

                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Crie sua conta
                    </Heading>

                    <Input 
                        placeholder='Nome'
                    />

                    <Input 
                        placeholder='Email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <Input 
                        placeholder='Senha'
                        secureTextEntry
                    />

                    <Button title='Criar e acessar'/>
                </Center>

                    <Button 
                        mt={24}
                        title='Voltar para Login' 
                        variant='outline'
                        onPress={handleGoBack}
                    />

            </VStack>
        </ScrollView>
    )
}