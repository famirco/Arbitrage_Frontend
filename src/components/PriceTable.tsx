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
  // ساخت ماتریس قیمت‌ها (توکن × RPC)
  const priceMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, PriceRecord | undefined>> = {};
    
    // ایجاد ساختار اولیه برای همه توکن‌ها
    STATIC_TOKENS.forEach(token => {
      matrix[token.symbol] = {};
      STATIC_RPCS.forEach(rpc => {
        matrix[token.symbol][rpc] = undefined;
      });
    });

    // پر کردن ماتریس با داده‌های واقعی
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
            <th>Price Difference</th>
          </tr>
        </thead>
        <tbody>
          {STATIC_TOKENS.map(token => (
            STATIC_RPCS.map((rpc, rpcIndex) => {
              const price = priceMatrix[token.symbol][rpc];
              const basePrice = Object.values(priceMatrix[token.symbol]).find(p => p !== undefined);
              
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
                  <td>{price ? `$${parseFloat(price.price_usdc).toFixed(6)}` : 'N/A'}</td>
                  <td>{price ? `$${parseFloat(price.gas_fee).toFixed(6)}` : 'N/A'}</td>
                  <td>
                    {price && basePrice ? (
                      <span style={{
                        color: Math.abs(parseFloat(price.price_usdc) - parseFloat(basePrice.price_usdc)) > 0.000001 ? 'green' : 'inherit',
                        fontWeight: Math.abs(parseFloat(price.price_usdc) - parseFloat(basePrice.price_usdc)) > 0.000001 ? 'bold' : 'normal'
                      }}>
                        {((parseFloat(price.price_usdc) - parseFloat(basePrice.price_usdc)) / parseFloat(basePrice.price_usdc) * 100).toFixed(2)}%
                      </span>
                    ) : 'N/A'}
                  </td>
                </tr>
              );
            })
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};