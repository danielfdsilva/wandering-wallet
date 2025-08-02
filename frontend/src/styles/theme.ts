import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: '"Exo 2", sans-serif' },
        heading: { value: '"Exo 2", sans-serif' }
      }
    }
  }
});

export default createSystem(defaultConfig, config);
