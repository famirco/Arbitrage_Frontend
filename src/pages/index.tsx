import { useState, useEffect } from 'react';
import { Container, Space } from '@mantine/core';
import axios from 'axios';
import { PriceTable } from '../components/PriceTable';
import { ArbitrageTable } from '../components/ArbitrageTable';

export default function Home() {
  const [prices, setPrices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        const [pricesRes, oppsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/price_records`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/arbitrage_opportunities`)
        ]);
        setPrices(pricesRes.data);
        setOpportunities(oppsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAndUpdateData(); // اجرای اولیه
    const interval = setInterval(fetchAndUpdateData, 30000); // هر 30 ثانیه به‌روزرسانی

    return () => clearInterval(interval); // پاکسازی interval در زمان unmount
  }, []);

  return (
    <Container size="xl" py="xl">
      <PriceTable prices={prices} />
      <Space h="xl" />
      <ArbitrageTable opportunities={opportunities} />
    </Container>
  );
}