import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  // Fetch coin data
  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-cATvn4erjJXZwsUmEoPidsWt' },
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error('Error fetching coin data:', err);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    if (!currency?.name) return; // Ensure currency exists
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-cATvn4erjJXZwsUmEoPidsWt' },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        options
      );
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  // Fetch data when currency changes
  useEffect(() => {
    if (coinId && currency) {
      fetchCoinData();
      fetchHistoricalData();
    }
  }, [coinId, currency]);

  // Check if data is loaded and render the component
  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData?.image?.large} alt="" />
        <p>
          <b>
            {coinData?.name} ({coinData?.symbol?.toUpperCase()})
          </b>
        </p>
      </div>
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>
      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData?.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>
            {currency?.symbol} {coinData?.market_data?.current_price?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency?.symbol} {coinData?.market_data?.market_cap?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>
            {currency?.symbol} {coinData?.market_data?.high_24h?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>
            {currency?.symbol} {coinData?.market_data?.low_24h?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
