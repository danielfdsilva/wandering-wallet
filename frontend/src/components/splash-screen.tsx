import { VStack, Text, Image } from '@chakra-ui/react';

import bg from '../ww-bg.png';
import logo from '../ww-logo.png';

export default function SplashScreen({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <VStack
      gap={8}
      align='center'
      justify='center'
      h='100vh'
      p={8}
      bg={`url(${bg})`}
      bgSize='cover'
      color='#fff'
    >
      <VStack gap={4} textAlign='center'>
        <Image src={logo} w='6rem' />
        <Text fontSize='2xl' fontWeight='bold'>
          Bem vindo ao <br /> Wandering Wallet
        </Text>
        {children}
      </VStack>
    </VStack>
  );
}
