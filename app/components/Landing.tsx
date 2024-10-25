import {
  Button,
  Image,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import styles from "@styles/Home.module.css";
import Link from "next/link";
import React from "react";

function Landing() {
  const { openConnectModal } = useConnectModal();

  // Responsive padding and alignment for mobile and desktop views
  return (
    <VStack
      className={styles.videoBackground}
      h="100vh"
      w="full"
      px={{ base: 4, md: 0 }} // Adds padding for mobile, removes for desktop
      spacing={{ base: 8, md: 12 }} // Adjusts spacing between elements
      align="center"
      justify="center"
    >
      <VStack
        className={styles.content}
        spacing={{ base: 4, md: 6 }}
        align="center"
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            cursor="pointer"
            className={styles.logo}
          ></Image>
        </Link>
        <Text
          fontSize={{ base: "md", md: "lg" }} // Responsive subtitle size
          textAlign="center"
        >
          Where simplicity meets innovation in ticketing.
        </Text>
        <Button
          size={{ base: "sm", md: "md" }} // Responsive button size
          onClick={openConnectModal}
          className={`${styles.button} w-full max-w-xs`} // Full width on mobile, limited on desktop
        >
          LAUNCH YOUR EVENT
        </Button>
      </VStack>
    </VStack>
  );
}

export default Landing;
