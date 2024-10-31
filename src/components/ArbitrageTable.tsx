import React from 'react';
import { Table, Paper, Title, Text } from '@mantine/core';

interface Token {
  id: number;
  symbol: string;
  name: string;
}

interface ArbitrageOpportunity {
  id: number;
  token_id: number;
  token?: Token;
  buy_price: string;
  sell_price: string;
  profit: string;
  buy_rpc: string;
  sell_rpc: string;
  gas_fee: string;
  status: string;
  created_at: string;
}

interface ArbitrageTableProps {
  opportunities: ArbitrageOpportunity[];
}

export const ArbitrageTable = ({ opportunities = [] }: ArbitrageTableProps) => {
  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Title order={2} mb="md">Arbitrage Opportunities</Title>
        <Text>No arbitrage opportunities available</Text>
      </Paper>
    );
  }

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
                <div>
                  <strong>{opp.token?.symbol || `Token ${opp.token_id}`}</strong>
                  <div style={{ color: 'gray', fontSize: '0.9em' }}>
                    {opp.token?.name || 'Unknown'}
                  </div>
                </div>
              </td>
              <td>${parseFloat(opp.buy_price).toFixed(6)}</td>
              <td>${parseFloat(opp.sell_price).toFixed(6)}</td>
              <td style={{ color: parseFloat(opp.profit) > 0 ? 'green' : 'inherit' }}>
                {parseFloat(opp.profit).toFixed(2)}%
              </td>
              <td>{new URL(opp.buy_rpc).hostname}</td>
              <td>{new URL(opp.sell_rpc).hostname}</td>
              <td>${parseFloat(opp.gas_fee).toFixed(6)}</td>
              <td>
                <span style={{ 
                  color: opp.status === 'detected' ? 'blue' : 
                         opp.status === 'executed' ? 'green' : 'red'
                }}>
                  {opp.status}
                </span>
              </td>
              <td>{new Date(opp.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};