import React, { useState } from 'react';
import { VStack, HStack, FlatList, Heading, Text} from 'native-base';
import { Group } from '../components/Group';
import { HomeHeader } from '../components/HomeHeader';
import { ExerciseCard } from '../components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../routes/app.routes';

export function Home(){
    const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Peito', 'Pernas', 'Ombros']);
    const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Rosca direta', 'Levantamento Terra', 'Supino', 'Agachamento', 'Rosca martelo']);
    const [ groupSelected, setGroupSelected ] = useState('Costas');

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(){
        navigation.navigate('exercise');
    }

    return (
        <VStack flex={1}>
            <HomeHeader/>

            <FlatList
                data={groups}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8}}  
                my={10}
                maxH={10}
                renderItem={({item}) => (
                    <Group 
                        name={item}
                        isActive={groupSelected === item} 
                        onPress={() => setGroupSelected(item)}
                    />
                )}
            />

            <VStack flex={1} px={8} mb={5}>
                <HStack justifyContent='space-between' mb={4}>
                    <Heading color='gray.200' fontSize='md'>
                        Exercícios
                    </Heading>

                    <Text color='gray.200' fontSize='sm'>
                        {exercises.length}
                    </Text>
                </HStack>
                
                <FlatList 
                    data={exercises}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <ExerciseCard 
                            onPress={handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ pb: 20}}
                />
            </VStack>

        </VStack>
    )
}