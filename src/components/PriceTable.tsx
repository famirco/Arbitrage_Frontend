import React from 'react';
import { Table, Paper, Title, Text } from '@mantine/core';

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

export const PriceTable = ({ prices = [] }: PriceTableProps) => {
  if (!Array.isArray(prices) || prices.length === 0) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Title order={2} mb="md">Live Price Comparison</Title>
        <Text>No price data available</Text>
      </Paper>
    );
  }

  const validPrices = prices.filter(price => 
    price && 
    price.token && 
    typeof price.token === 'object' &&
    price.token.symbol
  );

  if (validPrices.length === 0) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Title order={2} mb="md">Live Price Comparison</Title>
        <Text>No valid price data available</Text>
      </Paper>
    );
  }

  const groupedPrices = validPrices.reduce<Record<string, PriceRecord[]>>((acc, price) => {
    const symbol = price.token?.symbol || 'Unknown';
    if (!acc[symbol]) {
      acc[symbol] = [];
    }
    acc[symbol].push(price);
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
          {Object.entries(groupedPrices).map(([symbol, tokenPrices]) => {
            const validPriceValues = tokenPrices
              .map(p => parseFloat(p.price_usdc))
              .filter(p => !isNaN(p));

            const minPrice = Math.min(...validPriceValues);
            const maxPrice = Math.max(...validPriceValues);
            const priceDiff = minPrice > 0 ? ((maxPrice - minPrice) / minPrice * 100).toFixed(2) : '0.00';

            return tokenPrices.map((price, idx) => (
              <tr key={price.id || idx}>
                {idx === 0 && (
                  <td rowSpan={tokenPrices.length}>
                    <div>
                      <strong>{symbol}</strong>
                      <div style={{ color: 'gray', fontSize: '0.9em' }}>
                        {price.token?.name || 'Unknown'}
                      </div>
                    </div>
                  </td>
                )}
                <td>{price.rpc_url ? new URL(price.rpc_url).hostname : 'N/A'}</td>
                <td>${parseFloat(price.price_usdc || '0').toFixed(6)}</td>
                <td>${parseFloat(price.gas_fee || '0').toFixed(6)}</td>
                {idx === 0 && (
                  <td rowSpan={tokenPrices.length} style={{ color: parseFloat(priceDiff) > 1 ? 'green' : 'inherit' }}>
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