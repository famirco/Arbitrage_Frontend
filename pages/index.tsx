const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amirez.info/api/v1';

const fetchData = async () => {
  try {
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    const tokensResponse = await axios.get(`${API_URL}/tokens`, config);
    const priceRecordsResponse = await axios.get(`${API_URL}/price_records`, config);
    
    setTokens(tokensResponse.data);
    setPriceRecords(priceRecordsResponse.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};