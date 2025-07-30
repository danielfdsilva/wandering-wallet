import { Button, VStack, Text, Image } from '@chakra-ui/react';
import { useAuth } from '../contexts/auth-context';

export default function Login() {
  const { login } = useAuth();

  return (
    <VStack spacing={8} align="center" justify="center" h="100vh">
      <VStack spacing={4}>
        <Image src="/meta/ww-icon.png" w="6rem" />
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Wandering Wallet
        </Text>
        <Text color="gray.600">
          Please sign in with your authorized Google account
        </Text>
      </VStack>
      <Button
        colorScheme="blue"
        size="lg"
        onClick={() => login()}
        leftIcon={
          <Image
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            w="1.5rem"
          />
        }
      >
        Sign in with Google
      </Button>
    </VStack>
  );
}
