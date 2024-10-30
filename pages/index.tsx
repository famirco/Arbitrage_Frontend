/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Token {
  id: number
  name: string
  symbol: string
  contract_address: string
}

interface PriceRecord {
  id: number
  token_id: number
  price_usdc: string
  gas_fee: string
  rpc_url: string
  created_at: string
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [prices, setPrices] = useState<PriceRecord[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokensResponse, pricesResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/v1/tokens'),
          axios.get('http://localhost:3000/api/v1/price_records')
        ])

        setTokens(tokensResponse.data)
        setPrices(pricesResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crypto Arbitrage Dashboard</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Token</th>
              <th className="px-4 py-2">Price (USDC)</th>
              <th className="px-4 py-2">Gas Fee</th>
              <th className="px-4 py-2">RPC URL</th>
              <th className="px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => {
              const token = tokens.find(t => t.id === price.token_id)
              return (
                <tr key={price.id}>
                  <td className="border px-4 py-2">{token?.symbol}</td>
                  <td className="border px-4 py-2">${price.price_usdc}</td>
                  <td className="border px-4 py-2">${price.gas_fee}</td>
                  <td className="border px-4 py-2">{price.rpc_url}</td>
                  <td className="border px-4 py-2">
                    {new Date(price.created_at).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
