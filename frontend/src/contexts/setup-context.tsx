import { Text } from '@chakra-ui/react';
import { createContext, useContext, useEffect, useState } from 'react';
import SplashScreen from '../components/splash-screen';

interface SetupContextType {
  googleClientId: string;
  participants: string[];
  tripName: string;
  currencies: string[];
  splits: string[];
}

const SetupContext = createContext<SetupContextType>({
  googleClientId: '',
  participants: [],
  tripName: '',
  currencies: [],
  splits: []
});

export function SetupProvider({
  children
}: {
  children: (ctx: SetupContextType) => React.ReactNode;
}) {
  const [googleClientId, setGoogleClientId] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [tripName, setTripName] = useState('');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [splits, setSplits] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/setup`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch setup data');
        }

        setGoogleClientId(data.googleClientId);
        setParticipants(data.participants);
        setTripName(data.tripName);
        setCurrencies(data.currencies);
        setSplits(data.splits);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const value = {
    googleClientId,
    participants,
    tripName,
    currencies,
    splits
  };

  if (isLoading) {
    return (
      <SplashScreen>
        <Text fontSize='lg' color='white'>
          A carregar informações da viagem...
        </Text>
      </SplashScreen>
    );
  }

  if (error) {
    return (
      <SplashScreen>
        <Text
          fontSize='lg'
          color='red.500'
          bg='red.200'
          px={4}
          py={2}
          borderRadius='md'
        >
          Ocorreu um erro: {error}
        </Text>
      </SplashScreen>
    );
  }

  if (!tripName) {
    return (
      <SplashScreen>
        <Text fontSize='lg' color='white'>
          Não existe nenhuma viagem a decorrer.
        </Text>
      </SplashScreen>
    );
  }

  return (
    <SetupContext.Provider value={value}>
      {children(value)}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
}
