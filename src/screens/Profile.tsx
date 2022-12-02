import { VStack, ScrollView, Center, Skeleton, Text, Heading, useToast} from 'native-base';
import { useState } from 'react';
import { TouchableOpacity  } from 'react-native';
import { yupResolver} from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import defaultUserPhotoImg from '../assets/userPhotoDefault.png';

import { ScreenHeader } from '../components/ScreenHeader';
import { UserPhoto } from '../components/UserPhoto';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { AppError } from '../utils/AppError';

const PHOTO_SIZE = 33;

type FormDataProps ={
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    old_password: yup.string(),
    password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value: null)
        .min(3, 'No mínimo 3 caracteres'),     
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value: null)
        .oneOf([yup.ref('password'), null], 'Confirmação incorreta')
        .when('password', {
            is: (Field: any) => Field,
            then: yup
                .string()
                .nullable()
                .required('Informe a confirmação de senha')
                .transform((value) => !!value ? value: null)
        }),
});


export function Profile(){
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();
    const {user, updateUserProfile} = useAuth()
    const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
    }, 
    resolver: yupResolver(profileSchema)
});


    async function handleSelectedUserPhoto(){
        setPhotoIsLoading(true);
        try {
            const photoData  = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });
    
            if(photoData.canceled){
                return;
            }

            const selectedPhoto = photoData.assets[0]
    
           if(selectedPhoto){
                const photoInfo = await FileSystem.getInfoAsync(selectedPhoto.uri);
                
                if(photoInfo.size &&(photoInfo.size / 1024 / 1024) > 5){
                    return toast.show({
                        title: 'Essa imagem é muito grande, selecione uma imagem menor que 5MB',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }

                const fileExtension = selectedPhoto.uri.split('.').pop();

                const photoFile ={
                    name: `${user.id}.${fileExtension}`.toLowerCase(),
                    uri: selectedPhoto.uri,
                    type: `${selectedPhoto.type}/${fileExtension}`,
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const updatedAvatarResponse =  await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                const updatedUser = user;
                updatedUser.avatar = updatedAvatarResponse.data.avatar;
                updateUserProfile(updatedUser);

                toast.show({
                    title: 'Foto atualizada com sucesso',
                    placement: 'top',
                    bgColor: 'green.500',
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false);
        }

    }

    async function handleUpdateProfile(data: FormDataProps){
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put('/users', data)

            await updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados.Tente novamente mais tarde.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsUpdating(false);
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
                        source={
                            user.avatar 
                                ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} 
                                : defaultUserPhotoImg
                            }
                        alt="Foto de perfil"
                        size={PHOTO_SIZE}
                    />}

                    <TouchableOpacity onPress={handleSelectedUserPhoto}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                    
                    <Controller 
                        control={control}
                        name='name'
                        render={({ field: { onChange, value } }) => (
                            <Input
                            bg='gray.600'
                            placeholder='Nome'
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.name?.message}
                        />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='email'
                        render={({ field: { onChange, value } }) => (
                            <Input
                            bg='gray.600'
                            placeholder='E-mail'
                            onChangeText={onChange}
                            value={value}
                            isDisabled
                        />
                        )}
                    />
                
                    <Heading color='gray.200' fontSize="md" mb={2} alignSelf='flex-start' mt={12}>
                        Alterar Senha
                    </Heading>

                    <Controller 
                        control={control}
                        name='old_password'
                        render={({ field: { onChange, value } }) => (
                            <Input
                            bg='gray.600'
                            placeholder='Senha antiga'
                            onChangeText={onChange}
                            secureTextEntry
                            errorMessage={errors.old_password?.message}
                        />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='password'
                        render={({ field: { onChange } }) => (
                            <Input
                            bg='gray.600'
                            placeholder='Nova senha'
                            onChangeText={onChange}
                            secureTextEntry
                            errorMessage={errors.password?.message}
                        />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='confirm_password'
                        render={({ field: { onChange } }) => (
                            <Input
                            bg='gray.600'
                            placeholder='Confirme a nova senha'
                            onChangeText={onChange}
                            secureTextEntry
                            errorMessage={errors.confirm_password?.message}
                        />
                        )}
                    />

                    <Button
                        title='Atualizar'
                        mt={4}
                        onPress={handleSubmit(handleUpdateProfile)}
                        isLoading={isUpdating}
                    />
                    
                </Center>
            </ScrollView>
            
        </VStack>
    )
}