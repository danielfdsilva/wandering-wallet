import { Button, VStack, Text, Image } from '@chakra-ui/react';
import { useAuth } from '../contexts/auth-context';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  const { login } = useAuth();

  return (
    <VStack gap={8} align='center' justify='center' h='100vh'>
      <VStack gap={4}>
        <Image src='/meta/ww-icon.png' w='6rem' />
        <Text fontSize='2xl' fontWeight='bold'>
          Bem vindo ao Wandering Wallet
        </Text>
      </VStack>
      <Button colorPalette='teal' size='lg' onClick={() => login()}>
        <FaGoogle />
        Entrar com Google
      </Button>
    </VStack>
  );
}
