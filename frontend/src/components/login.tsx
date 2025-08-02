import { Button } from '@chakra-ui/react';
import { useAuth } from '../contexts/auth-context';
import { FaGoogle } from 'react-icons/fa';
import SplashScreen from './splash-screen';

export default function Login() {
  const { login } = useAuth();

  return (
    <SplashScreen>
      <Button colorPalette='teal' size='lg' onClick={() => login()} mt={8}>
        <FaGoogle />
        Entrar com Google
      </Button>
    </SplashScreen>
  );
}
