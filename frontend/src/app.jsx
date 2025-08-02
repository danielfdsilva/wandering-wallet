import ExpenseForm from './components/expense-form';
import Login from './components/login';
import { Container, Heading, Image, HStack, Text } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';
import { UserInfo } from './components/user-info';
import { useAuth } from './contexts/auth-context';
import { useSetup } from './contexts/setup-context';

import bg from './ww-bg.png';
import logo from './ww-logo.png';

function App() {
  const { user, isLoading } = useAuth();
  const setupInfo = useSetup();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Container maxW='35rem' pb={8} pt={4}>
      <HStack
        as='header'
        justifyContent='space-between'
        mb={4}
        mx={-4}
        mt={-4}
        p={2}
        px={4}
        bg={`url(${bg})`}
        bgSize='cover'
      >
        <Image src={logo} w='2rem' />
        <UserInfo />
      </HStack>

      <Heading
        size='3xl'
        display='flex'
        flexFlow='column'
        alignItems='center'
        mb={2}
      >
        <Text>Registo Despesas</Text>
        <Text color='grey' fontSize='sm' fontWeight='normal'>
          ({setupInfo.tripName})
        </Text>
      </Heading>
      <ExpenseForm />
      <Toaster />
    </Container>
  );
}

export default App;
