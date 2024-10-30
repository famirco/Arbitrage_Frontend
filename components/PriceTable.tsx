import React from 'react';
import { Table, Badge, Paper, Title } from '@mantine/core';

interface ArbitrageOpportunity {
  id: number;
  token: {
    symbol: string;
    name: string;
  };
  buy_price: string;
  sell_price: string;
  profit: string;
  buy_rpc: string;
  sell_rpc: string;
  gas_fee: string;
  status: string;
  created_at: string;
}

export const ArbitrageTable: React.FC<{ opportunities: ArbitrageOpportunity[] }> = ({ opportunities }) => {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Title order={2} mb="md">Arbitrage Opportunities</Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Token</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Profit %</th>
            <th>Buy RPC</th>
            <th>Sell RPC</th>
            <th>Gas Fee</th>
            <th>Status</th>
            <th>Detected At</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td>
                <Text weight={500}>{opp.token.symbol}</Text>
                <Text size="sm" color="dimmed">{opp.token.name}</Text>
              </td>
              <td>${parseFloat(opp.buy_price).toFixed(6)}</td>
              <td>${parseFloat(opp.sell_price).toFixed(6)}</td>
              <td style={{ color: 'green' }}>{parseFloat(opp.profit).toFixed(2)}%</td>
              <td>{new URL(opp.buy_rpc).hostname}</td>
              <td>{new URL(opp.sell_rpc).hostname}</td>
              <td>${parseFloat(opp.gas_fee).toFixed(6)}</td>
              <td>
                <Badge 
                  color={opp.status === 'detected' ? 'blue' : opp.status === 'executed' ? 'green' : 'red'}
                >
                  {opp.status}
                </Badge>
              </td>
              <td>{new Date(opp.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};