import React, { useMemo } from 'react';
import { Table, Paper, Title, Text } from '@mantine/core';

interface Token {
  id: number;
  symbol: string;
  name: string;
}

// توکن‌های ثابت
const STATIC_TOKENS: Token[] = [
  { id: 1, symbol: 'FTM', name: 'Fantom' },
  { id: 2, symbol: 'LUMOS', name: 'Lumos' },
  { id: 3, symbol: 'WIGO', name: 'Wigo' }
];

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
  // Group prices by token_id and add static tokens
  const groupedPrices = useMemo(() => {
    const grouped: Record<number, PriceRecord[]> = {};
    
    // Initialize groups for all static tokens
    STATIC_TOKENS.forEach(token => {
      grouped[token.id] = [];
    });

    // Group actual prices
    prices.forEach(price => {
      const tokenId = price.token_id;
      if (!grouped[tokenId]) {
        grouped[tokenId] = [];
      }
      // Add static token info if missing
      const staticToken = STATIC_TOKENS.find(t => t.id === tokenId);
      if (staticToken) {
        price.token = staticToken;
      }
      grouped[tokenId].push(price);
    });

    return grouped;
  }, [prices]);

  // Get unique RPC URLs
  const uniqueRPCs = useMemo(() => {
    const rpcSet = new Set<string>();
    prices.forEach(price => rpcSet.add(price.rpc_url));
    return Array.from(rpcSet);
  }, [prices]);

  if (uniqueRPCs.length === 0) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Title order={2} mb="md">Live Price Comparison</Title>
        <Text>No price data available</Text>
      </Paper>
    );
  }

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
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
          {STATIC_TOKENS.map(token => {
            const tokenPrices = groupedPrices[token.id] || [];
            return tokenPrices.map((price, idx) => (
              <tr key={`${token.id}-${price.id}`}>
                {idx === 0 && (
                  <td rowSpan={tokenPrices.length || 1}>
                    <div>
                      <strong>{token.symbol}</strong>
                      <div style={{ color: 'gray', fontSize: '0.9em' }}>
                        {token.name}
                      </div>
                    </div>
                  </td>
                )}
                {tokenPrices.length > 0 ? (
                  <>
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
                      const priceDiff = ((parseFloat(price.price_usdc) - parseFloat(comparePrice.price_usdc)) 
                        / parseFloat(comparePrice.price_usdc) * 100).toFixed(2);
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
                  </>
                ) : (
                  <td colSpan={3 + uniqueRPCs.length}>No price data available</td>
                )}
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </Paper>
  );
};