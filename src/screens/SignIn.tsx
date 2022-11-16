import { VStack, Image, Text, Center } from 'native-base';

import LogoSvg from '../assets/logo.svg';
import BackGroundImg from '../assets/background.png'

export function SignIn(){
    return (
        <VStack flex={1} bg="gray.700">
            <Image 
                source={BackGroundImg} 
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


        </VStack>
    )
}