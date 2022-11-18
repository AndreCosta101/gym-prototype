import { useState } from 'react';
import { VStack, HStack, FlatList} from 'native-base';
import { Group } from '../components/Group';
import { HomeHeader } from '../components/HomeHeader';

export function Home(){
    const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Peito', 'Pernas', 'Ombros']);
    const [ groupSelected, setGroupSelected ] = useState('Costas');


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
            <HStack>


            </HStack>

        </VStack>
    )
}