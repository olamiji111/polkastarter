'use client';

import { FC, SVGProps } from "react";
import { ProjectCoinEthereum, ProjectCoinBase, BNB, Sei, Arbitrum } from "@/components/icons/icons";
import { useEffect, useState } from "react";

 export type CoinType = "base" | "ethereum" | "polygon" | "bnb" | "arbitrum";

// Return component type
export const getIcon = (cointype?: CoinType): FC<SVGProps<SVGSVGElement>> | null => {
  switch (cointype) {
    case "base":
      return ProjectCoinBase;
    case "ethereum":
      return ProjectCoinEthereum;
    case "bnb":
      return BNB;
     case "arbitrum":
      return Arbitrum;
    default:
      return null;
  }
};

export const getTodayFormatted = () => {
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' }); // e.g., "October"
  const year = date.getFullYear();

  // Add ordinal suffix to the day
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${month} ${day}${getOrdinal(day)}, ${year}`;
};




export type CountdownUnit = {
  title: "days" | "hours" | "minutes" | "seconds";
  number: number;
};

export const getCountdown = (saleDate: string, saleTime: string): CountdownUnit[] => {
  // Parse as UTC manually to avoid timezone offset
  const [year, month, day] = saleDate.split("-").map(Number);
  const [hours, minutes, seconds] = saleTime.split(":").map(Number);

  // Always create the date as UTC
  const target = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  const now = Date.now();

  const diff = target - now;

  if (diff <= 0) {
    return [
      { title: "days", number: 0 },
      { title: "hours", number: 0 },
      { title: "minutes", number: 0 },
      { title: "seconds", number: 0 },
    ];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutesLeft = Math.floor((diff / (1000 * 60)) % 60);
  const secondsLeft = Math.floor((diff / 1000) % 60);

  return [
    { title: "days", number: days },
    { title: "hours", number: hoursLeft },
    { title: "minutes", number: minutesLeft },
    { title: "seconds", number: secondsLeft },
  ];
};

export const getCountdownString = (targetDate: string, targetTime: string): string => {
  const target = new Date(`${targetDate}T${targetTime}Z`).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return "0d 0h 0m 0s";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};