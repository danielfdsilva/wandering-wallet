import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Field,
  InputGroup,
  SegmentGroup,
  createListCollection,
  Select,
  Portal
} from '@chakra-ui/react';
import { IoMdTrain } from 'react-icons/io';
import {
  MdHotel,
  MdRestaurant,
  MdLocalPlay,
  MdAccountBalanceWallet
} from 'react-icons/md';
import { BiYen, BiEuro } from 'react-icons/bi';
import { toaster } from './ui/toaster';

const people = createListCollection({
  items: [
    { label: 'Daniel', value: 'Daniel' },
    { label: 'Sílvia', value: 'Sílvia' }
  ]
});
const defaultPeople = people.items.map((item) => item.value);

const categories = [
  { id: 'Alojamento', label: 'Alojamento', icon: MdHotel },
  { id: 'Refeições', label: 'Refeições', icon: MdRestaurant },
  { id: 'Lazer (museus e afins)', label: 'Lazer', icon: MdLocalPlay },
  { id: 'Pocket money', label: 'Pocket €', icon: MdAccountBalanceWallet },
  { id: 'Transporte', label: 'Transporte', icon: IoMdTrain }
];

export default function ExpenseForm() {
  const { user } = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [currency, setCurrency] = useState('yen');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState(defaultPeople);

  const handleCategoryClick = (catId) => {
    setCategory(catId);
    setCustomCategory('');
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    if (value) {
      setCategory('');
    }
  };

  const handleSubmit = async (e) => {
    if (isSubmitting) return; // Prevent multiple submissions
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          category: customCategory || category,
          date,
          currency,
          participants: participants.length === 2 ? 'Ambos' : participants[0]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit expense');
      }

      toaster.create({
        title: 'Sucesso',
        description: 'Despesa adicionada com sucesso!',
        type: 'success',
        duration: 3000,
        isClosable: true
      });
      setAmount('');
      setDescription('');
      setCategory('');
      setCustomCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setParticipants(defaultPeople);
    } catch (error) {
      console.error('Error:', error);
      toaster.create({
        title: 'Erro',
        description: 'Erro ao adicionar despesa. Tenta novamente.',
        type: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <VStack gap={8} as='form' onSubmit={handleSubmit}>
        <VStack required>
          <HStack spacing={2} wrap='wrap' justify='center'>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                flexFlow='column'
                size='lg'
                width='7rem'
                height='auto'
                py={4}
                px={3}
                gap={1}
                variant={category === cat.id ? 'solid' : 'subtle'}
                colorPalette={category === cat.id ? 'teal' : 'gray'}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <cat.icon />
                {cat.label}
              </Button>
            ))}
          </HStack>
          <InputGroup startAddon='Outra'>
            <Input
              type='text'
              size='lg'
              id='customCategory'
              value={customCategory}
              onChange={handleCustomCategoryChange}
              placeholder='Define outra categoria'
            />
          </InputGroup>
        </VStack>

        <Field.Root>
          <Field.Label htmlFor='amount'>Valor</Field.Label>
          <HStack spacing={2} width='full'>
            <Input
              type='number'
              size='lg'
              id='amount'
              step='0.01'
              value={amount?.toString()}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Valor despesa'
            />
            <Button
              variant='outline'
              fontSize='1.5rem'
              size='lg'
              onClick={() =>
                setAmount((prev) =>
                  prev ? ((parseFloat(prev) * 2) / 3).toFixed(2) : ''
                )
              }
            >
              ⅔
            </Button>
          </HStack>
        </Field.Root>

        <HStack width='full'>
          <Field.Root>
            <Field.Label htmlFor='currency'>Currency</Field.Label>
            <SegmentGroup.Root
              size='lg'
              value={currency}
              onValueChange={(e) => setCurrency(e.value)}
            >
              <SegmentGroup.Indicator bg='teal.500' />
              <SegmentGroup.Item value='yen'>
                <SegmentGroup.ItemText
                  color={currency === 'yen' ? 'white' : undefined}
                >
                  <BiYen />
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
              <SegmentGroup.Item value='eur'>
                <SegmentGroup.ItemText
                  color={currency === 'eur' ? 'white' : undefined}
                >
                  <BiEuro />
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label htmlFor='date'>Date</Field.Label>
            <HStack spacing={2} width='full'>
              <Input
                type='date'
                size='lg'
                id='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </HStack>
          </Field.Root>
        </HStack>

        <Field.Root>
          <Field.Label htmlFor='description'>Description</Field.Label>
          <Input
            type='text'
            id='description'
            size='lg'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Descreve a despesa (opcional)'
          />
        </Field.Root>

        <Select.Root
          multiple
          collection={people}
          value={participants}
          onValueChange={(e) => setParticipants(e.value)}
          size='lg'
        >
          <Select.HiddenSelect />
          <Select.Label>Intervenientes</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder='Escolhe intervenientes' />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {people.items.map((person) => (
                  <Select.Item item={person} key={person.value}>
                    {person.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Button
          type='submit'
          colorScheme='blue'
          width='full'
          size='lg'
          loadingText='A adicionar...'
          loading={isSubmitting}
          disabled={
            (!category && !customCategory) ||
            !amount ||
            !date ||
            !participants?.length
          }
        >
          Adicionar Despesa
        </Button>
      </VStack>
    </Box>
  );
}
