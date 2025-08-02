import { Avatar, Button, Drawer, Portal } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '../contexts/auth-context';

export function UserInfo() {
  const auth = useAuth();

  if (!auth.user) {
    return null;
  }

  return (
    <Drawer.Root size='xs'>
      <Drawer.Trigger asChild>
        <Button
          variant='ghost'
          color='white'
          mr={-4}
          _hover={{
            bg: 'whiteAlpha.300'
          }}
        >
          {auth.user.name}
          <Avatar.Root size='xs' colorPalette='secondary'>
            <Avatar.Fallback name={auth.user.name} />
            <Avatar.Image src={auth.user.picture} />
          </Avatar.Root>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content rounded='sm' width='12rem'>
            <Drawer.Header p={4}>
              <Drawer.Title>Opções</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body p={0}>
              <Button
                variant='ghost'
                onClick={() => auth.logout()}
                w='100%'
                borderRadius='none'
                justifyContent='start'
                gap={6}
                color='red.600'
                size='sm'
              >
                <MdLogout /> Terminar sessão
              </Button>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
