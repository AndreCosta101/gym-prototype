import { VStack, ScrollView, Center, Skeleton, Text, Heading} from 'native-base';
import { useState } from 'react';
import { Alert, TouchableOpacity  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from '../components/ScreenHeader';
import { UserPhoto } from '../components/UserPhoto';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const PHOTO_SIZE = 33;

export function Profile(){
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/andrecosta101.png');

    async function handleSelectUserPhoto(){
        setPhotoIsLoading(true);
        try {
            const selectedPhoto  = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });
    
            if(selectedPhoto.canceled){
                return;
            }
    
           if(selectedPhoto.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(selectedPhoto.assets[0].uri);
                
                if(photoInfo.size &&(photoInfo.size / 1024 / 1024) > 5){
                    return Alert.alert('Essa imagem é muito grande, selecione uma imagem menor que 5MB');
                }

                setUserPhoto(selectedPhoto.assets[0].uri);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false);
        }

    }


    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>

            
            <ScrollView contentContainerStyle={{paddingBottom: 300}}>
                <Center mt={6} px={10}>
                    { photoIsLoading ? 
                    <Skeleton 
                        w={PHOTO_SIZE} 
                        h={PHOTO_SIZE} 
                        rounded="full"
                        startColor="gray.500"
                        endColor="gray.400" 
                    />
                    :
                    <UserPhoto 
                        source={{uri: userPhoto}}
                        alt="Foto de perfil"
                        size={PHOTO_SIZE}
                    />}

                    <TouchableOpacity onPress={handleSelectUserPhoto}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input
                        bg='gray.600'
                        placeholder='Nome'
                    />

                    <Input
                        bg='gray.600'
                        placeholder='E-mail'
                        isDisabled
                    />
                
                    <Heading color='gray.200' fontSize="md" mb={2} alignSelf='flex-start' mt={12}>
                        Alterar Senha
                    </Heading>
                    
                    <Input 
                        bg='gray.600'
                        placeholder='Senha antiga'
                        secureTextEntry
                    />

                    <Input 
                        bg='gray.600'
                        placeholder='Nova senha'
                        secureTextEntry
                    />

                    <Input 
                        bg='gray.600'
                        placeholder='Confirme nova senha'
                        secureTextEntry
                    />

                    <Button
                        title='Atualizar'
                        mt={4}

                    />
                    
                </Center>
            </ScrollView>
            
        </VStack>
    )
}