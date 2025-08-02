import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app.jsx';
import { AuthProvider } from './contexts/auth-context';
import { SetupProvider } from './contexts/setup-context';

import system from './styles/theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <SetupProvider>
        {(ctx) => (
          <GoogleOAuthProvider clientId={ctx.googleClientId}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </GoogleOAuthProvider>
        )}
      </SetupProvider>
    </ChakraProvider>
  </StrictMode>
);
