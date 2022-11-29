import { Center, Heading } from 'native-base';

type Props = {
    title: string;
}

export function ScreenHeader({title}: {title: string}){

    return (
        <Center bg='gray.600' pb={6} pt={16}>
            <Heading color='gray.100' fontSize='xl' fontFamily='heading'>
                {title}
            </Heading>
        </Center>
    )
}