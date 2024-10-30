import React from 'react';
import { Table, Paper, Title, Text } from '@mantine/core';

interface Token {
  symbol: string;
  name: string;
}

interface ArbitrageOpportunity {
  id: number;
  token?: Token;
  buy_price?: string;
  sell_price?: string;
  profit?: string;
  buy_rpc?: string;
  sell_rpc?: string;
  gas_fee?: string;
  status?: string;
  created_at?: string;
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

  const validOpportunities = opportunities.filter(opp => 
    opp && 
    opp.token && 
    typeof opp.token === 'object' &&
    opp.token.symbol
  );

  if (validOpportunities.length === 0) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Title order={2} mb="md">Arbitrage Opportunities</Title>
        <Text>No valid arbitrage opportunities available</Text>
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
          {validOpportunities.map((opp) => {
            const buyPrice = parseFloat(opp.buy_price || '0');
            const sellPrice = parseFloat(opp.sell_price || '0');
            const profit = parseFloat(opp.profit || '0');
            const gasFee = parseFloat(opp.gas_fee || '0');
            
            return (
              <tr key={opp.id || Math.random()}>
                <td>
                  <div>
                    <strong>{opp.token?.symbol || 'Unknown'}</strong>
                    <div style={{ color: 'gray', fontSize: '0.9em' }}>
                      {opp.token?.name || 'Unknown'}
                    </div>
                  </div>
                </td>
                <td>${buyPrice.toFixed(6)}</td>
                <td>${sellPrice.toFixed(6)}</td>
                <td style={{ color: profit > 0 ? 'green' : 'inherit' }}>
                  {profit.toFixed(2)}%
                </td>
                <td>{opp.buy_rpc ? new URL(opp.buy_rpc).hostname : 'N/A'}</td>
                <td>{opp.sell_rpc ? new URL(opp.sell_rpc).hostname : 'N/A'}</td>
                <td>${gasFee.toFixed(6)}</td>
                <td>
                  <span style={{ 
                    color: opp.status === 'detected' ? 'blue' : 
                           opp.status === 'executed' ? 'green' : 'red'
                  }}>
                    {opp.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  {opp.created_at ? 
                    new Date(opp.created_at).toLocaleString() : 
                    'Unknown'
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Paper>
  );
};