import { VStack, Heading, SectionList, Text} from 'native-base';
import { HistoryCard } from '../components/HistoryCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { useState } from 'react';

export function History(){
    const [exercises, setExercises] = useState([
        {
        title: '26.08.22',
        data: ['Puxada Frontal', 'Remada unilateral']
        },
        {
        title: '27.08.22',
        data: ['Puxada Frontal']
        },
])
    return (
        <VStack flex={1}>
            <ScreenHeader title='Histórico de Exercícios'/>

            <SectionList
                sections={exercises}
                keyExtractor={(item) => item}
                renderItem={({item}) => (
                    <HistoryCard />
                )}
                renderSectionHeader={({section}) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily='heading'>
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle= {
                    exercises.length === 0 && { flex:1 , justifyContent: 'center', alignItems: 'center'}
                }
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Não há exercícios cadastrados. {'\n'}
                        Vamos malhar hoje?
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />
        </VStack>
    )
}