import { VStack, ScrollView, Center, Skeleton, Text} from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { UserPhoto } from '../components/UserPhoto';

const PHOTO_SIZE = 33;

export function Profile(){
    const [photoIsLoaded, setPhotoIsLoaded] = useState(false);
    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>
            <ScrollView>
                <Center mt={6} px={10}>
                    { photoIsLoaded ? 
                    <Skeleton 
                        w={PHOTO_SIZE} 
                        h={PHOTO_SIZE} 
                        rounded="full"
                        startColor="gray.500"
                        endColor="gray.400" 
                    />
                    :
                    <UserPhoto 
                        source={{uri: 'https://github.com/andrecosta101.png'}}
                        alt="Foto de perfil"
                        size={PHOTO_SIZE}
                    />}

                    <TouchableOpacity>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                </Center>
                
            </ScrollView>
        </VStack>
    )
}