import ExpenseForm from './components/expense-form';
import Login from './components/login';
import { Container, Heading, Image, HStack } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';
import { UserInfo } from './components/user-info';
import { useAuth } from './contexts/auth-context';

import logo from './ww-logo.png';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Container maxW='35rem' pb={8} pt={4}>
      <HStack as='header' justifyContent='space-between' mb={4}>
        <Image src={logo} w='2rem' />
        <UserInfo />
      </HStack>

      <Heading
        size='3xl'
        display='flex'
        alignItems='center'
        mb={8}
        justifyContent='center'
      >
        Registo Despesas
      </Heading>
      <ExpenseForm />
      <Toaster />
    </Container>
  );
}

export default App;
