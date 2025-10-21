'use client';

import React, { useEffect, useRef } from 'react';

const TradingViewMiniChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // cleanup old script
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;

    // ⚡️ this is where you configure the chart
    script.innerHTML = JSON.stringify({
      symbol: "COINBASE:POLSUSDC", // exchange:pair
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "3M",             // July–Sep window
      colorTheme: "light",         // or "dark"
      isTransparent: false,
      autosize: true,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default TradingViewMiniChart;