import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { HStack, Image } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { address } = useAccount();
  const { route } = useRouter();
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 500;

  if ((route === "/" && !address) || isMobile) return;

  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>
      <HStack>
        <ConnectButton />
      </HStack>
    </HStack>
  );
};

export default Navbar;
