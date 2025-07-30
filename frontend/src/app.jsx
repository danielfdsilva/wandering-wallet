import ExpenseForm from './components/expense-form';
import Login from './components/login';
import { Container, Heading, Image, Button, HStack } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './contexts/auth-context';

import logo from './ww-logo.png';

function App() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Container maxW='35rem' py={8}>
      <Heading
        mb={6}
        size='3xl'
        display='flex'
        alignItems='center'
        gap={4}
        justifyContent='center'
      >
        <Image src={logo} w='2rem' />
        Wandering Wallet
      </Heading>
      <HStack justify="flex-end" mb={4}>
        <Button size="sm" onClick={logout}>
          Sign Out
        </Button>
      </HStack>
      <ExpenseForm />
      <Toaster />
    </Container>
  );
}

export default App;
