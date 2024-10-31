import React from 'react';
import { Table, Paper, Title, Text } from '@mantine/core';

interface Token {
  id: number;
  symbol: string;
  name: string;
}

interface PriceRecord {
  id: number;
  token_id: number;
  token?: Token;
  price_usdc: string;
  gas_fee: string;
  rpc_url: string;
}

interface PriceTableProps {
  prices: PriceRecord[];
}

export const PriceTable = ({ prices = [] }: PriceTableProps) => {
  if (!Array.isArray(prices) || prices.length === 0) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Title order={2} mb="md">Live Price Comparison</Title>
        <Text>No price data available</Text>
      </Paper>
    );
  }

  // Group prices by token_id
  const groupedPrices = prices.reduce<Record<number, PriceRecord[]>>((acc, price) => {
    if (!acc[price.token_id]) {
      acc[price.token_id] = [];
    }
    acc[price.token_id].push(price);
    return acc;
  }, {});

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Title order={2} mb="md">Live Price Comparison</Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Token</th>
            <th>RPC URL</th>
            <th>Price (USDC)</th>
            <th>Gas Fee</th>
            <th>Price Difference</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedPrices).map(([tokenId, tokenPrices]) => {
            const validPrices = tokenPrices
              .map(p => parseFloat(p.price_usdc))
              .filter(p => !isNaN(p) && p > 0);

            const minPrice = Math.min(...validPrices);
            const maxPrice = Math.max(...validPrices);
            const priceDiff = validPrices.length >= 2 
              ? ((maxPrice - minPrice) / minPrice * 100).toFixed(2)
              : '0.00';

            return tokenPrices.map((price, idx) => (
              <tr key={`${price.id}-${idx}`}>
                {idx === 0 && (
                  <td rowSpan={tokenPrices.length}>
                    <div>
                      <strong>{price.token?.symbol || `Token ${price.token_id}`}</strong>
                      <div style={{ color: 'gray', fontSize: '0.9em' }}>
                        {price.token?.name || 'Unknown'}
                      </div>
                    </div>
                  </td>
                )}
                <td>{new URL(price.rpc_url).hostname}</td>
                <td>${parseFloat(price.price_usdc).toFixed(6)}</td>
                <td>${parseFloat(price.gas_fee).toFixed(6)}</td>
                {idx === 0 && (
                  <td 
                    rowSpan={tokenPrices.length} 
                    style={{ 
                      color: parseFloat(priceDiff) > 1 ? 'green' : 'inherit',
                      fontWeight: parseFloat(priceDiff) > 1 ? 'bold' : 'normal'
                    }}
                  >
                    {priceDiff}%
                  </td>
                )}
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </Paper>
  );
};