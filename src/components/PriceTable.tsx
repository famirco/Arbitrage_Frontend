import React, { useMemo } from 'react';
import { Table, Paper, Title, Text } from '@mantine/core';

// تعریف RPC های ثابت
const STATIC_RPCS = [
  'https://rpc.ftm.tools',
  'https://rpcapi.fantom.network',
  'https://rpc.ankr.com/fantom'
];

// تعریف توکن های ثابت
const STATIC_TOKENS = [
  { id: 1, symbol: 'FTM', name: 'Fantom' },
  { id: 2, symbol: 'LUMOS', name: 'Lumos' },
  { id: 3, symbol: 'WIGO', name: 'Wigo' }
];

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
  const priceMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, PriceRecord | undefined>> = {};
    
    STATIC_TOKENS.forEach(token => {
      matrix[token.symbol] = {};
      STATIC_RPCS.forEach(rpc => {
        matrix[token.symbol][rpc] = undefined;
      });
    });

    prices.forEach(price => {
      const token = STATIC_TOKENS.find(t => t.id === price.token_id);
      if (token) {
        matrix[token.symbol][price.rpc_url] = price;
      }
    });

    return matrix;
  }, [prices]);

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const calculatePriceDiff = (price1?: PriceRecord, price2?: PriceRecord) => {
    if (!price1 || !price2) return 'N/A';
    const diff = ((parseFloat(price1.price_usdc) - parseFloat(price2.price_usdc)) 
      / parseFloat(price2.price_usdc) * 100);
    return (
      <span style={{
        color: Math.abs(diff) > 0.1 ? (diff > 0 ? 'green' : 'red') : 'inherit',
        fontWeight: Math.abs(diff) > 0.1 ? 'bold' : 'normal'
      }}>
        {diff.toFixed(2)}%
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
            {STATIC_RPCS.map(rpc => (
              <th key={rpc}>vs {getHostname(rpc)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STATIC_TOKENS.map(token => (
            STATIC_RPCS.map((rpc, rpcIndex) => {
              const currentPrice = priceMatrix[token.symbol][rpc];
              
              return (
                <tr key={`${token.symbol}-${rpc}`}>
                  {rpcIndex === 0 && (
                    <td rowSpan={STATIC_RPCS.length}>
                      <div>
                        <strong>{token.symbol}</strong>
                        <div style={{ color: 'gray', fontSize: '0.9em' }}>
                          {token.name}
                        </div>
                      </div>
                    </td>
                  )}
                  <td>{getHostname(rpc)}</td>
                  <td>{currentPrice ? `$${parseFloat(currentPrice.price_usdc).toFixed(6)}` : 'N/A'}</td>
                  <td>{currentPrice ? `$${parseFloat(currentPrice.gas_fee).toFixed(6)}` : 'N/A'}</td>
                  {STATIC_RPCS.map(compareRpc => {
                    const comparePrice = priceMatrix[token.symbol][compareRpc];
                    if (compareRpc === rpc) {
                      return <td key={compareRpc}>-</td>;
                    }
                    return (
                      <td key={compareRpc}>
                        {calculatePriceDiff(currentPrice, comparePrice)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};