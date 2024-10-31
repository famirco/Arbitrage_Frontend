// ... (بقیه کد بدون تغییر)

return (
  <Paper shadow="sm" p="md" withBorder>
    <Title order={2} mb="md">Live Price Comparison</Title>
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Token</th>
          <th>RPC URL</th>
          <th>Price (USDC)</th>
          <th>Gas Fee</th>
          <th>Price Difference</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedPrices).map(([tokenId, tokenPrices]) => {
          const validPrices = tokenPrices
            .map(p => parseFloat(p.price_usdc))
            .filter(p => !isNaN(p) && p > 0);

          const minPrice = Math.min(...validPrices);
          const maxPrice = Math.max(...validPrices);
          const priceDiff = validPrices.length >= 2 
            ? ((maxPrice - minPrice) / minPrice * 100).toFixed(2)
            : '0.00';

          return tokenPrices.map((price, idx) => (
            <tr key={`${price.id}-${idx}`}>
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
              {idx === 0 && (
                <td 
                  rowSpan={tokenPrices.length} 
                  style={{ 
                    color: parseFloat(priceDiff) > 1 ? 'green' : 'inherit',
                    fontWeight: parseFloat(priceDiff) > 1 ? 'bold' : 'normal'
                  }}
                >
                  {priceDiff}%
                </td>
              )}
            </tr>
          ));
        })}
      </tbody>
    </Table>
  </Paper>
);