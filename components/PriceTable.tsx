import React from 'react';
import { Table, Text, Paper, Title } from '@mantine/core';

interface PriceRecord {
  id: number;
  token: {
    symbol: string;
    name: string;
  };
  price_usdc: string;
  gas_fee: string;
  rpc_url: string;
}

export const PriceTable: React.FC<{ prices: PriceRecord[] }> = ({ prices }) => {
  const groupedPrices = prices.reduce((acc, price) => {
    if (!acc[price.token.symbol]) {
      acc[price.token.symbol] = [];
    }
    acc[price.token.symbol].push(price);
    return acc;
  }, {} as Record<string, PriceRecord[]>);

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
          {Object.entries(groupedPrices).map(([symbol, prices]) => {
            const minPrice = Math.min(...prices.map(p => parseFloat(p.price_usdc)));
            const maxPrice = Math.max(...prices.map(p => parseFloat(p.price_usdc)));
            const priceDiff = ((maxPrice - minPrice) / minPrice * 100).toFixed(2);

            return prices.map((price, idx) => (
              <tr key={price.id}>
                {idx === 0 && (
                  <td rowSpan={prices.length}>
                    <div>
                      <strong>{symbol}</strong>
                      <div style={{ color: 'gray', fontSize: '0.9em' }}>{price.token.name}</div>
                    </div>
                  </td>
                )}
                <td>{new URL(price.rpc_url).hostname}</td>
                <td>${parseFloat(price.price_usdc).toFixed(6)}</td>
                <td>${parseFloat(price.gas_fee).toFixed(6)}</td>
                {idx === 0 && (
                  <td rowSpan={prices.length} style={{ color: parseFloat(priceDiff) > 1 ? 'green' : 'inherit' }}>
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