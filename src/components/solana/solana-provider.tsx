"use client";

import { HARDCODED_WALLET_STANDARDS, metadata } from "@/lib/wallets";
import {
  Adapter,
  ConnectionProvider,
  UnifiedWalletProvider,
  WalletAdapterNetwork,
} from "@jup-ag/wallet-adapter";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

interface IHawksightClientProvider {
  children: React.ReactNode;
}

const HawksightClientProvider = ({ children }: IHawksightClientProvider) => {
  const [queryClient] = useState(() => new QueryClient());

  const endpoint = process.env.NEXT_PUBLIC_MAINNET_RPC || "";

  const wallets = useMemo(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return [new PhantomWalletAdapter(), new SolflareWalletAdapter()].filter(
      (item) => item && item.name && item.icon
    ) as Adapter[];
  }, []);

  const unifiedWalletProviderParams: Omit<
    Parameters<typeof UnifiedWalletProvider>[0],
    "children"
  > = useMemo(
    () => ({
      wallets,
      config: {
        autoConnect: true,
        env: WalletAdapterNetwork.Mainnet,
        metadata,
        hardcodedWallets: HARDCODED_WALLET_STANDARDS,
        walletlistExplanation: {
          href: "https://station.jup.ag/docs/additional-topics/wallet-list",
        },
        theme: "dark",
        lang: "en",
      },
    }),
    [wallets]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider
        endpoint={endpoint}
        config={{
          confirmTransactionInitialTimeout: 30000,
          commitment: "confirmed",
          disableRetryOnRateLimit: true,
        }}
      >
        <UnifiedWalletProvider {...unifiedWalletProviderParams}>
          {children}
        </UnifiedWalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export default HawksightClientProvider;
