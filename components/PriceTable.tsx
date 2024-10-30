import React from 'react';
import { Table, Paper, Title } from '@mantine/core';

interface Token {
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

interface PriceTableProps {
  prices: PriceRecord[];
}

export const PriceTable: React.FC<PriceTableProps> = ({ prices }) => {
  // ... rest of the code remains the same
};