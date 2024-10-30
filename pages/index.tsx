import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amirez.info/api/v1';

interface Token {
  id: number;
  name: string;
  symbol: string;
  contract_address: string;
}

interface PriceRecord {
  id: number;
  token_id: number;
  price_usdc: string;
  gas_fee: string;
  rpc_url: string;
  created_at: string;
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [priceRecords, setPriceRecords] = useState<PriceRecord[]>([]);

  const fetchData = async () => {
    try {
      const tokensResponse = await axios.get(`${API_URL}/tokens`);
      const priceRecordsResponse = await axios.get(`${API_URL}/price_records`);
      
      setTokens(tokensResponse.data);
      setPriceRecords(priceRecordsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crypto Arbitrage Data</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tokens</h2>
        <div className="grid gap-4">
          {tokens.map((token: Token) => (
            <div key={token.id} className="border p-4 rounded">
              <p>Name: {token.name}</p>
              <p>Symbol: {token.symbol}</p>
              <p>Contract: {token.contract_address}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Price Records</h2>
        <div className="grid gap-4">
          {priceRecords.map((record: PriceRecord) => (
            <div key={record.id} className="border p-4 rounded">
              <p>Price USDC: {record.price_usdc}</p>
              <p>Gas Fee: {record.gas_fee}</p>
              <p>RPC URL: {record.rpc_url}</p>
              <p>Time: {