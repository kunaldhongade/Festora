"use client";
import { BiconomyProvider } from "@biconomy/use-aa";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { WagmiProvider } from "wagmi";
import { polygonAmoy, sepolia } from "wagmi/chains";

if (
  !process.env.NEXT_PUBLIC_PAYMASTER_API_KEY ||
  !process.env.NEXT_PUBLIC_BUNDLER_URL
) {
  throw new Error("Missing env var");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const paymasterApiKey = process.env.NEXT_PUBLIC_PAYMASTER_API_KEY || "";
  const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || "";

  const config = getDefaultConfig({
    appName: "Demo App",
    projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "",
    chains: [sepolia, polygonAmoy],
    transports: {
      [sepolia.id]: http(
        "https://eth-sepolia.g.alchemy.com/v2/fNTro6Lf7XPu_8usxR94twN88g8uksPx"
      ),
    },
    ssr: true,
  });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BiconomyProvider
            config={{
              // biconomyPaymasterApiKey: paymasterApiKey, // use this for development
              paymasterApiKey: paymasterApiKey, // use this for production
              bundlerUrl,
            }}
            queryClient={queryClient}
          >
            {children}
          </BiconomyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
