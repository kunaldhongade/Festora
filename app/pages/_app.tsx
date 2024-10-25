import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "@components/Navbar";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import merge from "lodash.merge";
import type { AppProps } from "next/app";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { fantom } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const TIXO_API_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? process.env.NEXT_PUBLIC_API_PROD
    : process.env.NEXT_PUBLIC_API_DEV;

export const TIXO_CLIENT_URL = process.env.NEXT_PUBLIC_TIXO_CLIENT_URL;

const { chains, provider } = configureChains([fantom], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "Tixo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const theme = extendTheme({
  styles: {
    global: {
      "*": {
        fontFamily: "Montserrat",
        color: "white",
      },
      button: {
        color: "white !important",
      },
      a: {
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
});

const customTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#1E1E1E",
  },
} as Theme);

export const ImageContext = createContext(null);

function MyApp({ Component, pageProps, router }: AppProps) {
  const [selectedImage, setSelectedImage] = useState("/0.jpg");

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        <ChakraProvider theme={theme}>
          <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
            <Head>
              <title>Festora: Events | Fests</title>
              <meta name="description" content="event management app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div
              className="dynamic-bg"
              style={{
                backgroundImage: `url(${selectedImage})`,
              }}
            >
              <Component {...pageProps} key={router.route} />
            </div>
          </ImageContext.Provider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
