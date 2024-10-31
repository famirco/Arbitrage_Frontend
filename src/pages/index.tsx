import { useState, useEffect } from 'react';
import { Container, Space, Text } from '@mantine/core';
import axios from 'axios';
import { PriceTable } from '../components/PriceTable';
import { ArbitrageTable } from '../components/ArbitrageTable';

// اضافه کردن در بالای فایل، بعد از import ها
const TEST_DATA = {
  tokens: [
    { id: 1, symbol: 'FTM', name: 'Fantom' },
    { id: 2, symbol: 'ETH', name: 'Ethereum' }
  ],
  prices: [
    {
      id: 1,
      token_id: 1,
      price_usdc: '1.167782',
      gas_fee: '0.203092',
      rpc_url: 'https://rpc.ftm.tools'
    },
    {
      id: 2,
      token_id: 1,
      price_usdc: '1.169000',
      gas_fee: '0.201000',
      rpc_url: 'https://rpcapi.fantom.network'
    }
  ],
  opportunities: [
    {
      id: 202,
      token_id: 1,
      buy_price: '1.265202',
      sell_price: '2.781261',
      profit: '119.83',
      buy_rpc: 'https://rpc.ftm.tools',
      sell_rpc: 'https://rpcapi.fantom.network',
      gas_fee: '0.203092',
      status: 'detected',
      created_at: new Date().toISOString()
    }
  ]
};

// و در useEffect برای تست:
useEffect(() => {
  const updateData = async () => {
    try {
      // برای تست با داده‌های ثابت:
      const tokensMap = TEST_DATA.tokens.reduce((acc, token) => {
        acc[token.id] = token;
        return acc;
      }, {} as Record<number, Token>);
      
      setTokens(tokensMap);
      setPrices(TEST_DATA.prices);
      setOpportunities(TEST_DATA.opportunities);
      
      // برای API واقعی (فعلاً کامنت شده):
      /*
      const [tokensRes, pricesRes, oppsRes] = await Promise.all([
        axios.get<Token[]>(`${process.env.NEXT_PUBLIC_API_URL}/tokens`),
        axios.get<PriceRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/price_records`),
        axios.get<ArbitrageOpportunity[]>(`${process.env.NEXT_PUBLIC_API_URL}/arbitrage_opportunities`)
      ]);
      
      const tokensMap = tokensRes.data.reduce((acc, token) => {
        acc[token.id] = token;
        return acc;
      }, {} as Record<number, Token>);

      setTokens(tokensMap);
      setPrices(pricesRes.data);
      setOpportunities(oppsRes.data);
      */
      
      setError(null);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(`Failed to fetch data: ${error.message}`);
    }
  };

  updateData();
  const interval = setInterval(updateData, 30000);
  return () => clearInterval(interval);
}, []);

interface Token {
  id: number;
  symbol: string;
  name: string;
}

interface PriceRecord {
  id: number;
  token_id: number;
  price_usdc: string;
  gas_fee: string;
  rpc_url: string;
}

interface ArbitrageOpportunity {
  id: number;
  token_id: number;
  buy_price: string;
  sell_price: string;
  profit: string;
  buy_rpc: string;
  sell_rpc: string;
  gas_fee: string;
  status: string;
  created_at: string;
}

export default function Home() {
  const [tokens, setTokens] = useState<Record<number, Token>>({});
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateData = async () => {
      try {
        const [tokensRes, pricesRes, oppsRes] = await Promise.all([
          axios.get<Token[]>(`${process.env.NEXT_PUBLIC_API_URL}/tokens`),
          axios.get<PriceRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/price_records`),
          axios.get<ArbitrageOpportunity[]>(`${process.env.NEXT_PUBLIC_API_URL}/arbitrage_opportunities`)
        ]);

        // Convert tokens array to a map for easy lookup
        const tokensMap = tokensRes.data.reduce((acc, token) => {
          acc[token.id] = token;
          return acc;
        }, {} as Record<number, Token>);

        setTokens(tokensMap);
        setPrices(pricesRes.data);
        setOpportunities(oppsRes.data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(`Failed to fetch data: ${error.message}`);
      }
    };

    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Enhance price records with token information
  const enhancedPrices = prices.map(price => ({
    ...price,
    token: tokens[price.token_id]
  }));

  // Enhance opportunities with token information
  const enhancedOpportunities = opportunities.map(opp => ({
    ...opp,
    token: tokens[opp.token_id]
  }));

  return (
    <Container size="xl" py="xl">
      {error && <Text color="red" mb="xl">{error}</Text>}
      <PriceTable prices={enhancedPrices} />
      <Space h="xl" />
      <ArbitrageTable opportunities={enhancedOpportunities} />
    </Container>
  );
}