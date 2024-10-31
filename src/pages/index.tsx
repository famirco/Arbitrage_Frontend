import { useState, useEffect } from 'react';
import { Container, Space, Text } from '@mantine/core';
import axios from 'axios';
import { PriceTable } from '../components/PriceTable';
import { ArbitrageTable } from '../components/ArbitrageTable';

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

        console.log('Tokens:', tokensRes.data);
        console.log('Prices:', pricesRes.data);
        console.log('Opportunities:', oppsRes.data);

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

  // Enhance price records with token information and remove duplicates
  const enhancedPrices = prices
    .map(price => ({
      ...price,
      token: tokens[price.token_id]
    }))
    .filter((price, index, self) => 
      index === self.findIndex((p) => (
        p.token_id === price.token_id && 
        p.rpc_url === price.rpc_url
      ))
    );

  // Enhance opportunities with token information and sort by profit
  const enhancedOpportunities = opportunities
    .map(opp => ({
      ...opp,
      token: tokens[opp.token_id]
    }))
    .sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit));

  return (
    <Container size="xl" py="xl">
      {error && <Text color="red" mb="xl">{error}</Text>}
      <PriceTable prices={enhancedPrices} />
      <Space h="xl" />
      <ArbitrageTable opportunities={enhancedOpportunities} />
    </Container>
  );
}