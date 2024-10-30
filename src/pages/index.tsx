import { useState, useEffect } from 'react';
import { Container, Space } from '@mantine/core';
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
  token: Token;
  price_usdc: string;
  gas_fee: string;
  rpc_url: string;
}

interface ArbitrageOpportunity {
  id: number;
  token: Token;
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
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);

  useEffect(() => {
    const updateData = async () => {
      try {
        const [pricesRes, oppsRes] = await Promise.all([
          axios.get<PriceRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/price_records`),
          axios.get<ArbitrageOpportunity[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/arbitrage_opportunities`)
        ]);
        setPrices(pricesRes.data);
        setOpportunities(oppsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container size="xl" py="xl">
      <PriceTable prices={prices} />
      <Space h="xl" />
      <ArbitrageTable opportunities={opportunities} />
    </Container>
  );
}