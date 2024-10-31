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

  // Get unique RPC URLs
  const uniqueRPCs = [...new Set(prices.map(p => p.rpc_url))];

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Title order={2} mb="md">Live Price Comparison</Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Token</th>
            <th>RPC</th>
            <th>Price (USDC)</th>
            <th>Gas Fee</th>
            {uniqueRPCs.map((rpc, index) => (
              <th key={index}>Price Diff vs {new URL(rpc).hostname}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedPrices).map(([tokenId, tokenPrices]) => 
            tokenPrices.map((price, idx) => (
              <tr key={price.id}>
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
                {uniqueRPCs.map((rpc, index) => {
                  if (rpc === price.rpc_url) {
                    return <td key={index}>-</td>;
                  }
                  const otherPrice = tokenPrices.find(p => p.rpc_url === rpc);
                  if (!otherPrice) {
                    return <td key={index}>N/A</td>;
                  }
                  const priceDiff = ((parseFloat(price.price_usdc) - parseFloat(otherPrice.price_usdc)) 
                    / parseFloat(otherPrice.price_usdc) * 100).toFixed(2);
                  return (
                    <td 
                      key={index}
                      style={{ 
                        color: Math.abs(parseFloat(priceDiff)) > 1 ? 'green' : 'inherit',
                        fontWeight: Math.abs(parseFloat(priceDiff)) > 1 ? 'bold' : 'normal'
                      }}
                    >
                      {priceDiff}%
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Paper>
  );
};