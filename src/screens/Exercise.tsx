import { VStack, Text, Icon, HStack, Heading, Image, Box, ScrollView, useToast} from 'native-base';
import { TouchableOpacity } from 'react-native';
import {Feather} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '../routes/app.routes';
import BodySvg from '../assets/body.svg';
import SeriesSvg from '../assets/series.svg';
import RepetitionsSvg from '../assets/repetitions.svg';
import { Button } from '../components/Button';
import { ExerciseDTO } from '../dtos/ExerciseDTO';
import { AppError } from '../utils/AppError';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Loading } from '../components/Loading';


type RouteParamsProps = {
    exerciseId: string;
}

export function Exercise(){
    const [sendingRegister, setSendingRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    
    const toast = useToast();

    const route = useRoute();
    const {exerciseId} = route.params as RouteParamsProps;

    function handleGoBack(){
        navigation.goBack();
    }

    async function fetchExerciseDetails(){
        try {
            setIsLoading(true);
            const response = await api.get(`/exercises/${exerciseId}`);
            setExercise(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false);
        }
    }

    async function handleExerciseHistoryRegistration(){
        try {
            setSendingRegister(true);
            
            await api.post('/history', {exercise_id: exerciseId});

            toast.show({
                title: 'Histórico registrado com sucesso',
                placement: 'top',
                bgColor: 'green.500',
            })

           navigation.navigate('history') 
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível registrar o exercício';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setSendingRegister(false);
        }
    }

    useEffect(() => {
        fetchExerciseDetails();
    }, [exerciseId]);

    return (
        <VStack flex={1}>
            {/* Header */}
            <VStack px={8} bg='gray.600' pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={Feather} name='arrow-left' color='green.500' size={6} />
                </TouchableOpacity>

                <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
                    <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
                        {exercise.name}
                    </Heading>
                

                    <HStack alignItems='center'>
                        <BodySvg/>
                        <Text color='gray.200' ml={1} textTransform='capitalize'>
                            costas
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            {/* Body */}
            {isLoading ? <Loading/> :
            
            <ScrollView>
                <VStack p={8}>
                    <Box rounded='lg' mb={3} overflow='hidden'>
                    <Image
                        w='full'
                        h={80}
                        source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                        alt='Nome do exercício'
                        mb={3}
                        resizeMode='cover'
                        rounded='lg'
                    />
                    </Box>

                    <Box bg='gray.600' rounded='md' pb={4} px={4}>   
                        <HStack alignItems='center' justifyContent='space-around' mb={6} mt={5}>
                            <HStack>
                                <SeriesSvg/>
                                <Text color='gray.200' ml={2} textTransform='capitalize'>
                                    {exercise.series} séries
                                </Text>
                            </HStack>
                            <HStack>
                                <RepetitionsSvg/>
                                <Text color='gray.200' ml={2} textTransform='capitalize'>
                                    {exercise.repetitions} repetições
                                </Text>
                            </HStack>
                        </HStack>  

                        <Button 
                            title='Marcar como realizado' 
                            onPress={handleExerciseHistoryRegistration}
                            isLoading={sendingRegister}
                        />           

                    </Box>
                </VStack>
            </ScrollView>
            }
        </VStack>
    )
}