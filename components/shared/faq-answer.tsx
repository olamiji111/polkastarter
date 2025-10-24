
"use client";

interface FAQAnswerProps {
  idx: number;
}

const FAQAnswer = ({ idx }: FAQAnswerProps) =>  {

  switch (idx) {
    // Case 0 → Ways to gain POLS Power
    case 0:
      return (
        <div className="space-y-3  font-[600]  text-[var(--type-1)] p-4 text-[19px] ">
          <p>There are two main ways to gain POLS Power:</p>
          <ol className="list-decimal list-inside space-y-1 marker:font-bold">
            <li>
              <strong>Stake POLS:</strong> Stake your tokens to instantly gain POLS Power, 
              but your tokens will be locked for 7 days.
            </li>
            <li>
              <strong>Provide Liquidity:</strong> Add liquidity to ETH/POLS (Uniswap) or 
              BNB/POLS (PancakeSwap) pairs to earn POLS Power along with fees.
            </li>
          </ol>
        </div>
      );

    // Case 1 → Exchanges
    case 1:
      return (
        <div className="text-[var(--type-1)]  leading-loose  p-6 text-[18px] font-[600] ">
          <p>
            $POLS is available on several major exchanges, including{" "}
            Coinbase, Kraken, KuCoin, Bitvavo, and Revolut.
          </p>
        </div>
      );

    // Case 2 → Steps to participate in IDO
    case 2:
      return (
        <div className="space-y-1 font-[600] text-[var(--type-1)] p-4 text-[19px] ">
          
          <ol className="list-decimal list-inside space-y-2 marker:font-bold">
          <li>
            <strong>Apply for the Project:</strong> Go to the Polkastarter Projects page, 
            choose an open project marked as &apos;Allowlist open&apos;, and submit the form.
          </li>
            <li>
              <strong>Accumulate POLS Power:</strong> Ensure you have at least 1,000 POLS Power 
              through one of these methods:
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Hold POLS in your wallet for 7+ days.</li>
                <li>Hold POLS LP Tokens for 7+ days.</li>
                <li>Stake POLS for instant eligibility (locks tokens for 7 days).</li>
              </ul>
            </li>
            <li>
              <strong>Check Application Status:</strong> After the lottery, check the Dashboard. 
              If &apos;Preselected&apos;, proceed to KYC.
            </li>
            <li>
              <strong>Pass KYC:</strong> Required for IDOs. Complete via email or directly from the Dashboard.
            </li>
            <li>
              <strong>Join the Sale:</strong> Once verified, you will be added to the allowlist 
              and can participate in the sale.
            </li>
          </ol>
        </div>
      );

    // Case 3 → Cooldown explanation
    case 3:
      return (
        <div className="space-y-3 text-left font-[600] text-[var(--type-1)] p-4 text-[18px]  ">
          <p>
            The cooldown period is a 7-day restriction 
            that prevents you from being pre-selected in a new allowlist lottery 
            after allocating funds (buying tokens) in an IDO.This ensures fairness by increasing the chances for participants who 
            were previously unsuccessful.
          </p>
          
             
          
          <p className="py-4">
          Cooldown begins only after funds are allocated. Participants with 30,000+ POLS Power 
            are exempt fro this restriction.
          </p>
        </div>
      );

    default:
      return <p className="text-[var(--type-1)]">No answer available.</p>;
  }
}

export default FAQAnswer;