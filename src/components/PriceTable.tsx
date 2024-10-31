import React, { useMemo } from 'react';
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
  const groupedPrices = useMemo(() => {
    return prices.reduce<Record<number, PriceRecord[]>>((acc, price) => {
      if (!acc[price.token_id]) {
        acc[price.token_id] = [];
      }
      acc[price.token_id].push(price);
      return acc;
    }, {});
  }, [prices]);

  // Get unique RPC URLs
  const uniqueRPCs = useMemo(() => {
    const rpcSet = new Set<string>();
    prices.forEach(price => rpcSet.add(price.rpc_url));
    return Array.from(rpcSet);
  }, [prices]);

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const renderPriceDifference = (currentPrice: string, comparePrice: string) => {
    const diff = ((parseFloat(currentPrice) - parseFloat(comparePrice)) / parseFloat(comparePrice) * 100);
    const formattedDiff = diff.toFixed(2);
    const isSignificant = Math.abs(diff) > 1;

    return (
      <span style={{ 
        color: isSignificant ? (diff > 0 ? 'green' : 'red') : 'inherit',
        fontWeight: isSignificant ? 'bold' : 'normal'
      }}>
        {formattedDiff}%
      </span>
    );
  };

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
              <th key={index}>vs {getHostname(rpc)}</th>
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
                      <strong>{price.token?.symbol || `Token ${tokenId}`}</strong>
                      <div style={{ color: 'gray', fontSize: '0.9em' }}>
                        {price.token?.name || 'Unknown'}
                      </div>
                    </div>
                  </td>
                )}
                <td>{getHostname(price.rpc_url)}</td>
                <td>${parseFloat(price.price_usdc).toFixed(6)}</td>
                <td>${parseFloat(price.gas_fee).toFixed(6)}</td>
                {uniqueRPCs.map((rpc, index) => {
                  if (rpc === price.rpc_url) {
                    return <td key={index}>-</td>;
                  }
                  const comparePrice = tokenPrices.find(p => p.rpc_url === rpc);
                  if (!comparePrice) {
                    return <td key={index}>N/A</td>;
                  }
                  return (
                    <td key={index}>
                      {renderPriceDifference(price.price_usdc, comparePrice.price_usdc)}
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