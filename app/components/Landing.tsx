import { Button, VStack, Text } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import styles from "@styles/Home.module.css";
import React from "react";

function Landing() {
  const { openConnectModal } = useConnectModal();

  return (
    <VStack margin="0 !important" className={styles.videoBackground}>
      <video
        playsInline
        autoPlay
        muted
        loop
        className={styles.videoBackgroundVideo}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <VStack className={styles.content}>
        <Text className={styles.landingTitle}>TIXO</Text>
        <Text className={styles.landingSubtitle}>
          Where simplicity meets innovation in ticketing.
        </Text>
        <Button className={styles.button} onClick={openConnectModal}>
          LAUNCH YOUR EVENT
        </Button>
      </VStack>
    </VStack>
  );
}

export default Landing;
