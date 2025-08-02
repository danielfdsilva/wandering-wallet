import { FormEventHandler, useEffect, useMemo, useState } from 'react';
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
import { CreatableSelect, SingleValue } from 'chakra-react-select';
import {
  MdHotel,
  MdRestaurant,
  MdLocalPlay,
  MdAccountBalanceWallet,
  MdTrain
} from 'react-icons/md';
import { BiYen, BiEuro, BiDollar, BiPound } from 'react-icons/bi';
import { toaster } from './ui/toaster';
import { useSetup } from '../contexts/setup-context';

const currencyIconMap = {
  jpy: <BiYen />,
  eur: <BiEuro />,
  usd: <BiDollar />,
  gbp: <BiPound />
};

const splitsMap = {
  '1/2': {
    value: 0.5,
    fraction: '½'
  },
  '2/3': {
    value: 2 / 3,
    fraction: '⅔'
  },
  '2/5': {
    value: 2 / 5,
    fraction: '⅖'
  }
};

const categories = [
  { id: 'Alojamento', label: 'Alojamento', icon: MdHotel },
  { id: 'Refeições', label: 'Refeições', icon: MdRestaurant },
  { id: 'Lazer', label: 'Lazer', icon: MdLocalPlay },
  { id: 'Pocket money', label: 'Pocket €', icon: MdAccountBalanceWallet },
  { id: 'Transporte', label: 'Transporte', icon: MdTrain }
];

export default function ExpenseForm() {
  const { user } = useAuth();
  const setupInfo = useSetup();

  const validSplits = setupInfo.splits.filter(
    (split) => !!splitsMap[split as keyof typeof splitsMap]
  );

  const { people, defaultPeople } = useMemo(() => {
    const people = createListCollection({
      items: setupInfo.participants.map((participant) => ({
        label: participant,
        value: participant
      }))
    });
    const defaultPeople = people.items.map((item) => item.value);
    return { people, defaultPeople };
  }, [setupInfo.participants]);

  const [categoryList, setCategoryList] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    // Fetch categories from the API and set them in state
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/expenses/categories`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: string[] = await response.json();
        const filteredCategories = data
          .filter((cat) => !categories.some((c) => c.id === cat))
          .map((cat) => ({
            value: cat,
            label: cat
          }));

        setCategoryList(filteredCategories);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const [isSubmitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [currency, setCurrency] = useState(setupInfo.currencies[0] || 'eur');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState(defaultPeople);

  const handleCategoryClick = (catId: string) => {
    setCategory(catId);
    setCustomCategory(null);
  };

  const handleCustomCategoryChange = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
    setCustomCategory(option);
    if (option) {
      setCategory(option.label);
    } else {
      setCategory('');
    }
  };

  const handleSubmit: FormEventHandler<HTMLDivElement> = async (e) => {
    if (isSubmitting) return; // Prevent multiple submissions
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            description,
            category: customCategory?.value || category,
            date,
            currency: currency.toLowerCase(),
            participants:
              participants.length === setupInfo.participants.length
                ? 'Ambos'
                : participants[0]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit expense');
      }

      toaster.create({
        title: 'Sucesso',
        description: 'Despesa adicionada com sucesso!',
        type: 'success',
        duration: 3000,
        closable: true
      });
      setAmount('');
      setDescription('');
      setCategory('');
      setCustomCategory(null);
      setDate(new Date().toISOString().split('T')[0]);
      setParticipants(defaultPeople);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting expense:', error);
      toaster.create({
        title: 'Erro',
        description: 'Erro ao adicionar despesa. Tenta novamente.',
        type: 'error',
        duration: 3000,
        closable: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <VStack gap={8} as='form' onSubmit={handleSubmit}>
        <VStack>
          <HStack gap={2} wrap='wrap' justify='center'>
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
          <InputGroup
            startAddon='Outra'
            css={{
              '& [data-group-item]': customCategory
                ? {
                    bg: 'teal.600',
                    color: 'white'
                  }
                : {}
            }}
          >
            <CreatableSelect
              size='lg'
              isClearable
              menuPortalTarget={document.body}
              selectedOptionColorPalette='teal'
              chakraStyles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 100
                })
              }}
              options={categoryList}
              value={customCategory}
              onChange={handleCustomCategoryChange}
            />
          </InputGroup>
        </VStack>

        <Field.Root>
          <Field.Label htmlFor='amount'>Valor</Field.Label>
          {!!validSplits && (
            <HStack gap={2} width='full'>
              <Input
                type='number'
                size='lg'
                id='amount'
                step='0.01'
                value={amount?.toString()}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Valor despesa'
              />
              {validSplits.map((split) => (
                <Button
                  key={split}
                  variant='outline'
                  fontSize='1.5rem'
                  size='lg'
                  onClick={() => {
                    setAmount((prev) =>
                      prev
                        ? (
                            parseFloat(prev) *
                            splitsMap[split as keyof typeof splitsMap].value
                          ).toFixed(2)
                        : ''
                    );
                  }}
                >
                  {splitsMap[split as keyof typeof splitsMap].fraction}
                </Button>
              ))}
            </HStack>
          )}
        </Field.Root>

        <HStack width='full'>
          {setupInfo.currencies.length > 1 && (
            <Field.Root>
              <Field.Label htmlFor='currency'>Currency</Field.Label>
              <SegmentGroup.Root
                size='lg'
                value={currency}
                onValueChange={(e) => setCurrency(e.value!)}
              >
                <SegmentGroup.Indicator bg='teal.600' />
                {setupInfo.currencies.map((curr) => (
                  <SegmentGroup.Item
                    key={curr}
                    value={curr}
                    color={currency === curr ? 'white' : undefined}
                  >
                    <SegmentGroup.ItemText>
                      {
                        // @ts-expect-error accessing icon from currencyIconMap
                        currencyIconMap[curr.toLowerCase()] || (
                          <span>{curr.toUpperCase()}</span>
                        )
                      }
                    </SegmentGroup.ItemText>
                    <SegmentGroup.ItemHiddenInput />
                  </SegmentGroup.Item>
                ))}
              </SegmentGroup.Root>
            </Field.Root>
          )}

          <Field.Root>
            <Field.Label htmlFor='date'>Date</Field.Label>
            <HStack gap={2} width='full'>
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
