// lib/utils/fetchPolsPrice.ts

// Base one-shot fetch
export const fetchPolsPrice = async (
  decimals: number = 2
): Promise<string | null> => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=polkastarter&vs_currencies=usd"
    );
    const data = await res.json();
    const price = data?.polkastarter?.usd;

    if (typeof price === "number") {
      return price.toFixed(decimals);
    }
    return null;
  } catch (error) {
    console.error("Error fetching POLS price:", error);
    return null;
  }
};

// Polling fetch every intervalMs (default 60s)
export const pollPolsPrice = (
  decimals: number = 2,
  intervalMs: number = 60_000,
  callback?: (price: string | null) => void
) => {
  // Run immediately once
  fetchPolsPrice(decimals).then((price) => {
    if (callback) callback(price);
  });

  // Run at interval
  const id = setInterval(async () => {
    const price = await fetchPolsPrice(decimals);
    if (callback) callback(price);
  }, intervalMs);

  return () => clearInterval(id); // cleanup function
};

export const fetchMarketCap = async (): Promise<string | null> => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/polkastarter?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
    );
    const data = await res.json();
    const cap = data?.market_data?.market_cap?.usd;

    if (typeof cap === "number") {
      return cap.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0, // no decimals for market cap
      });
    }

    return null;
  } catch (error) {
    console.error("Error fetching POLS market cap:", error);
    return null;
  }
};
// lib/fetchpolsprice.ts
export const fetchPolsChange = async () => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=polkastarter&vs_currencies=usd&include_24hr_change=true"
    );
    const data = await res.json();

    const changePercent = data?.polkastarter?.usd_24h_change ?? 0; // percentage
    const price = data?.polkastarter?.usd ?? 0; // current price

    // Calculate absolute increment/decrement
    const changeAmount = (price * (changePercent / 100)).toFixed(2);

    return {
      changePercent: changePercent.toFixed(2), // e.g. -4.54
      changeAmount, // e.g. 0.01
    };
  } catch (err) {
    console.error(err);
    return {
      changePercent: "0.00",
      changeAmount: "0.00",
    };
  }
};