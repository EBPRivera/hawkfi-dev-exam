"use client";

import { Button } from "@mui/material";
import { useWallet, useUnifiedWalletContext } from "@jup-ag/wallet-adapter";

export const WalletButton = () => {
  const { connected, connecting, disconnect } = useWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setShowModal(true);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        backgroundColor: "#46EB80",
        color: "#070D0A",
        "&:hover": {
          backgroundColor: "#3dd16f",
        },
        borderRadius: "12px",
        px: 4,
        py: 2,
        fontWeight: "bold",
        fontSize: "1.1rem",
      }}
    >
      {connecting
        ? "Connecting..."
        : connected
          ? "Disconnect"
          : "Connect Wallet"}
    </Button>
  );
};
