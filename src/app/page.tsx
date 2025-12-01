"use client";

import { Suspense } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { useWallet } from "@jup-ag/wallet-adapter";
import { WalletButton } from "@/components/solana/wallet-button";
import SnipeForm from "@/components/forms/snipe-form";
import { getPricesFromTokens } from "@/utils/price";
import { getBalance } from "@/utils/wallet";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const initialPrices = getPricesFromTokens()
  const balance = getBalance(publicKey?.toBase58())

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#070D0AE5",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: "1px solid rgba(70, 235, 128, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#46EB80",
            fontWeight: "bold",
          }}
        >
          HawkFi Dev Exam
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {connected && (
            <Typography
              variant="body2"
              sx={{
                color: "#46EB80",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {publicKey?.toString().slice(0, 8)}...
              {publicKey?.toString().slice(-8)}
            </Typography>
          )}
          <WalletButton />
        </Box>
      </Box>
      {connected ? (
        <Suspense fallback={<Skeleton variant="rectangular" />}>
          <SnipeForm initialPrices={initialPrices} balance={balance} />
        </Suspense>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            p: 4,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: "bold",
                color: "#46EB80",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              HawkfFi Dev Exam
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 4,
              }}
            >
              Connect your wallet to begin filling up the form
            </Typography>

            {!connected && (
              <Box sx={{ mt: 3 }}>
                <WalletButton />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
