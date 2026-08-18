import {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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
import { apiFetch } from '../lib/api';
import { applySplit, localDateString } from '../lib/expense-utils';

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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiFetch('/api/expenses/categories');
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [isSubmitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const originalAmountRef = useRef('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [currency, setCurrency] = useState(setupInfo.currencies[0] || 'eur');
  const [date, setDate] = useState(localDateString());
  const [participants, setParticipants] = useState(defaultPeople);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    originalAmountRef.current = value;
  };

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
    if (isSubmitting) return;
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toaster.create({
        title: 'Erro',
        description: 'O valor tem de ser positivo.',
        type: 'error',
        duration: 3000,
        closable: true
      });
      return;
    }

    setSubmitting(true);
    const submittedCategory = customCategory?.value || category;
    try {
      const response = await apiFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          amount: parsedAmount,
          description,
          category: submittedCategory,
          date,
          currency: currency.toLowerCase(),
          participants:
            participants.length === setupInfo.participants.length
              ? 'Ambos'
              : participants[0]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit expense');
      }

      await fetchCategories();

      toaster.create({
        title: 'Despesa adicionada',
        description: `${parsedAmount.toFixed(2)} ${currency.toUpperCase()} · ${submittedCategory}`,
        type: 'success',
        duration: 3000,
        closable: true
      });
      setAmount('');
      originalAmountRef.current = '';
      setDescription('');
      setCategory('');
      setCustomCategory(null);
      setDate(localDateString());
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

  const parsedAmount = parseFloat(amount);
  const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;

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
              placeholder='Categoria personalizada'
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
                name='amount'
                min={0.01}
                step='0.01'
                inputMode='decimal'
                value={amount?.toString()}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder='Valor despesa'
              />
              {validSplits.map((split) => (
                <Button
                  key={split}
                  type='button'
                  variant='outline'
                  fontSize='1.5rem'
                  size='lg'
                  onClick={() => {
                    setAmount(applySplit(originalAmountRef.current, split));
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
              <Field.Label htmlFor='currency'>Moeda</Field.Label>
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
            <Field.Label htmlFor='date'>Data</Field.Label>
            <HStack gap={2} width='full'>
              <Input
                type='date'
                size='lg'
                id='date'
                name='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </HStack>
          </Field.Root>
        </HStack>

        <Field.Root>
          <Field.Label htmlFor='description'>Descrição</Field.Label>
          <Input
            type='text'
            id='description'
            name='description'
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
            !hasValidAmount ||
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
