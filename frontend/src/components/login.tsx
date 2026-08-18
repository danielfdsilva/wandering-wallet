import { Button, Text } from '@chakra-ui/react';
import { useAuth } from '../contexts/auth-context';
import { FaGoogle } from 'react-icons/fa';
import SplashScreen from './splash-screen';

export default function Login() {
  const { login, loginError } = useAuth();

  return (
    <SplashScreen>
      {loginError ? (
        <Text
          fontSize='md'
          color='red.700'
          bg='red.100'
          px={4}
          py={2}
          borderRadius='md'
        >
          {loginError}
        </Text>
      ) : null}
      <Button colorPalette='teal' size='lg' onClick={() => login()} mt={8}>
        <FaGoogle />
        Entrar com Google
      </Button>
    </SplashScreen>
  );
}
