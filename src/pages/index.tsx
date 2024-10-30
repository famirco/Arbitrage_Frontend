import { useState, useEffect } from 'react';
import { Container, Space, Text } from '@mantine/core';
import axios from 'axios';
import { PriceTable } from '../components/PriceTable';
import { ArbitrageTable } from '../components/ArbitrageTable';

export default function Home() {
  const [prices, setPrices] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateData = async () => {
      try {
        const [pricesRes, oppsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/price_records`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/arbitrage_opportunities`)
        ]);
  
        // اضافه کردن log برای یک نمونه از داده‌ها
        console.log('Sample price record:', pricesRes.data[0]);
        console.log('Sample opportunity:', oppsRes.data[0]);
  
        setPrices(Array.isArray(pricesRes.data) ? pricesRes.data : []);
        setOpportunities(Array.isArray(oppsRes.data) ? oppsRes.data : []);
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
      {error && <Text color="red" mb="xl">{error}</Text>}
      <PriceTable prices={prices} />
      <Space h="xl" />
      <ArbitrageTable opportunities={opportunities} />
    </Container>
  );
}