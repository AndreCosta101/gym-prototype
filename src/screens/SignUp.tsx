import { VStack, Image, Text, Center, Heading, ScrollView} from 'native-base';

import LogoSvg from '../assets/logo.svg';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';


import BackGroundImg from '../assets/background.png'
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';

import { Input } from '../components/Input';    
import { Button } from '../components/Button';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha é obrigatória').min(8, 'No mínimo 8 caracteres'),
    password_confirmation: yup.string().required('Confirme a senha').oneOf([yup.ref('password'), null], 'As senhas precisam ser iguais')
})

export function SignUp(){

    const navigation = useNavigation();

    const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    function handleGoBack(){
        navigation.goBack();
    }

    function handleSignUp(data: FormDataProps){
        console.log(data)
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


                    <Controller
                        control={control}
                        name="name"
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password_confirmation"
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Confirme a senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                returnKeyType="send"
                                errorMessage={errors.password_confirmation?.message}
                            />
                        )}
                    />

                    <Button 
                        title='Criar e acessar'
                        onPress={handleSubmit(handleSignUp)}
                    />
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