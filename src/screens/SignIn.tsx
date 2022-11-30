import { useState } from "react";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast} from 'native-base';
import { AuthNavigatorRoutesProps} from '../routes/auth.routes';
import LogoSvg from '../assets/logo.svg';
import BackGroundImg from '../assets/background.png'
import { useAuth } from '../hooks/useAuth';

import { Input } from '../components/Input';    
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { AppError } from '../utils/AppError';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
    email: string;
    password: string;
}

export function SignIn(){
    const [loading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

    function handleNewAccount(){
        navigation.navigate('signUp');
    }

    async function handleSignIn({email, password}: FormData){
        try {
            setIsLoading(true);
            await signIn(email, password);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Erro no servidor. Não foi possível fazer login';
            
            setIsLoading(false);

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
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
                        Acesse sua conta
                    </Heading>

                <Controller 
                    control={control}
                    name="email"
                    rules={{ required: 'Informe o e-mail' }}
                    render={({ field: { onChange } }) => (
                    <Input 
                        placeholder="E-mail" 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={onChange}
                        errorMessage={errors.email?.message}
                    />
                    )}
                />
          
                <Controller 
                    control={control}
                    name="password"
                    rules={{ required: 'Informe a senha' }}
                    render={({ field: { onChange } }) => (
                    <Input 
                        placeholder="Senha" 
                        secureTextEntry
                        onChangeText={onChange}
                        errorMessage={errors.password?.message}
                    />
                    )}
                />

                    <Button 
                        title='Acessar'
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={loading}
                    />
                </Center>

                <Center mt={24}>
                    <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">     
                        Ainda não tem acesso?
                    </Text>

                    <Button 
                        title='Criar Conta' 
                        variant='outline'
                        onPress={handleNewAccount}
                    />
                </Center>

            </VStack>
        </ScrollView>
    )
}