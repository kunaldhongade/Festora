import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Button,
  HStack,
  Spinner,
  Text,
  VStack,
  Image,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Event } from "@utils/types";
import styles from "@styles/Home.module.css";
import { useAccount, useDisconnect, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import TixoProtocolV1 from "@data/TixoProtocolV1.json";
import QRCode from "react-qr-code";
import ReactCardFlip from "react-card-flip";
import { format } from "date-fns";
import { FaMapMarkerAlt, FaSmile } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { ImageContext, TIXO_API_URL, TIXO_CLIENT_URL } from "pages/_app";
import withTransition from "@components/withTransition";
import { loadStripe } from "@stripe/stripe-js";
import { abridgeAddress } from "@utils/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import SuccessLottie from "@components/SuccessLottie";
import { useSignMessage } from "wagmi";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);

const NFT_ADDRESS = process.env.NEXT_PUBLIC_TIXO_ADDRESS;

function EventPage() {
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();
  const { data: signer, isError } = useSigner();
  const provider = useProvider();
  const [event, setEvent] = useState<Event | null>(null);
  const [txnHash, setTxnHash] = useState<string>("");
  const [ticketId, setTicketId] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const { setSelectedImage } = useContext(ImageContext);
  const [isOwner, setIsOwner] = useState(false);
  const [count, setCount] = useState(0);
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  const { data: sign, signMessage } = useSignMessage({
    message:
      "I am signing this message on the Tixo Ticketing v1 Platform to verify the ownership of the Fantom Hacker Community NFT on my wallet.",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = useMemo(() => width <= 500, [width]);

  const isHost = useMemo(() => {
    if (!address) return false;
    return (
      event && event.hostId.toLocaleLowerCase() === address.toLocaleLowerCase()
    );
  }, [event, address]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleStripeCheckout = async () => {
    const success_url = `${TIXO_CLIENT_URL}${router.asPath}`;
    const cancel_url = `${TIXO_CLIENT_URL}${router.asPath}`;

    const response = await fetch(`${TIXO_API_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success_url, cancel_url }),
    });
    const session = await response.json();
    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      console.log(result.error.message);
    }
  };

  const handleShowDrawer = () => {
    onOpen();
  };

  const handleMintTicket = useCallback(async () => {
    if (!address) openConnectModal();

    setLoading(true);
    try {
      const contract = new ethers.Contract(
        NFT_ADDRESS,
        TixoProtocolV1.abi,
        signer
      );

      const txn = await contract.mintWithTokenURI(address, id, "");
      const lastTicketId = await contract.getLastTicketId(id);

      const ticketId =
        parseInt(id as string) * 10 ** 5 + lastTicketId.toNumber() + 1;

      const newAttendees = JSON.parse(JSON.stringify(event.attendees ?? {}));

      newAttendees[address] = {
        ticketId,
        status: "unused",
      };

      const updatedEvent = {
        ...event,
        attendees: newAttendees,
      };

      const response = await axios.put(
        `${TIXO_API_URL}/updateEvent/${id}`,
        updatedEvent
      );

      console.log(response.data);
      setEvent(updatedEvent);

      await txn.wait();

      setTxnHash(txn.hash);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [NFT_ADDRESS, address, signer, event]);

  const verifyOwnership = useCallback(async (userAddress: string) => {
    if (!userAddress) return;

    const contract = new ethers.Contract(
      NFT_ADDRESS,
      TixoProtocolV1.abi,
      provider
    );

    const balance = await contract.balanceOf(userAddress);
    const isOwner = balance.toNumber() > 0;

    setIsOwner(isOwner);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        try {
          const res = await axios.get(`${TIXO_API_URL}/event/id/${id}`);
          setEvent(res.data.event);
          setTicketId(res.data.event.attendees[address].ticketId);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event && event.bgImage === "/3.jpg" && isMobile) {
      setSelectedImage("/3-mobile.png");
    } else if (event && event.bgImage) {
      setSelectedImage(event.bgImage);
    }
  }, [event, isMobile]);

  const handleShareEvent = async () => {
    const copyShareMessage = `Check out this event on TIXO: ${window.location.href}`;

    await navigator.clipboard.writeText(copyShareMessage);

    toast({
      title: "Success",
      description: "Event URL copied to clipboard!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const qrUrl = `${TIXO_CLIENT_URL}/validate?eventId=${id}&ticketId=${ticketId}&address=${address}`;

  const formattedTime = useMemo(() => {
    if (!event) return "";

    return new Date(event.date * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  }, [event]);

  const isPrivateEvent = event && event.tokenAddress;
  const needsVerification = isPrivateEvent && !isOwner;

  const handleHiddenDisconnect = () => {
    if (count > 2) disconnect?.();
    else {
      setCount((prev) => prev + 1);
    }
  };

  // if (!isMobile)
  //   return (
  //     <main className={styles.main}>
  //       <Text className={styles.mobileText}>
  //         This page is only supported on mobile at the moment. Thank you for
  //         understanding.
  //       </Text>
  //     </main>
  //   );

  return (
    <main className={styles.main}>
      <Modal onClose={onModalClose} isOpen={isModalOpen} isCentered>
        <ModalOverlay />
        <ModalContent className={styles.modalContent}>
          <ModalHeader className={styles.modalHeader}>
            View Attendees
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Attendee</Th>
                    <Th>Ticket No.</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {event &&
                    Object.entries(event.attendees).map((a) => (
                      <Tr>
                        <Td>{abridgeAddress(a[0])}</Td>
                        <Td>{a[1].ticketId}</Td>
                        <Td>{a[1].status}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
      {!isMobile ? (
        event ? (
          <HStack>
            <VStack alignItems="flex-start" gap={3} maxWidth="500px">
              <Text className={styles.eventTitle}>
                {event.eventName ? event.eventName : "Untitled Event"}
              </Text>
              <VStack alignItems="flex-start">
                <Text className={styles.eventDate}>
                  {format(new Date(event.date * 1000), "eeee, MMMM do")}
                </Text>
                <Text className={styles.eventTime}>{formattedTime}</Text>
              </VStack>
              <VStack alignItems="flex-start">
                <HStack>
                  <FaSmile />
                  <Text>
                    Hosted by{" "}
                    <span className={styles.eventHost}>
                      {event.hostName
                        ? event.hostName.toLocaleUpperCase()
                        : "TBD"}
                    </span>
                  </Text>
                </HStack>
                <HStack>
                  <FaMapMarkerAlt />
                  <Text className={styles.eventLocation}>
                    {" "}
                    {event.location
                      ? event.location.value.structured_formatting.main_text
                      : "TBD"}
                  </Text>
                </HStack>
              </VStack>
              <Text>{event.description}</Text>
              <VStack alignItems="flex-start">
                <Text>
                  Number of Tickets Remaining:{" "}
                  {event.maxTickets - Object.keys(event.attendees).length}/
                  {event.maxTickets}
                </Text>
                <Text>
                  Cost per Ticket:{" "}
                  {event.costPerTicket === 0
                    ? "FREE"
                    : `$${event.costPerTicket}`}
                </Text>
              </VStack>
              <HStack gap={1}>
                {!ticketId ? (
                  <Button onClick={handleMintTicket} className={styles.button}>
                    {isLoading ? <Spinner color="black" /> : "Buy Ticket"}
                  </Button>
                ) : !isHost ? (
                  <Button onClick={handleFlip} className={styles.button}>
                    View ticket
                  </Button>
                ) : (
                  <Button onClick={onModalOpen} className={styles.button}>
                    View dashboard
                  </Button>
                )}
                <Button onClick={handleShareEvent} className={styles.button}>
                  Share Event
                </Button>
              </HStack>
            </VStack>
            <VStack>
              <Image src="/image.jpg" className={styles.eventImage} w="400px" />
            </VStack>
          </HStack>
        ) : (
          <Text>Loading...</Text>
        )
      ) : (
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal"
          containerStyle={{ height: "95vh" }}
        >
          <VStack w="100%" p="1rem" pt=".5rem">
            <Image src="/ticket.png" position="absolute" h="90vh" w="85vw" />
            {/* The front of the card */}
            {event ? (
              <VStack className={styles.contentContainer} gap={1}>
                <VStack w="100%" justifyContent="center">
                  <Image src="/image.jpg" w="240px" />
                </VStack>
                <Text className={styles.eventHeaderMobile}>EVENT:</Text>
                <Text className={styles.eventTitleMobile}>
                  {event.eventName}
                </Text>
                <VStack
                  className={needsVerification ? styles.isPrivate : ""}
                  w="100%"
                  alignItems="flex-start"
                >
                  {ticketId && (
                    <Text className={styles.eventTicketNo}>
                      TICKET NO. {ticketId}
                    </Text>
                  )}
                  <VStack alignItems="flex-start" pb="8px">
                    <Text className={styles.eventDateMobile}>
                      {format(
                        new Date(event.date ? event.date * 1000 : "2023-06-04"),
                        "eeee, MMMM do"
                      )}
                    </Text>
                    <Text className={styles.eventTimeMobile}>
                      {formattedTime}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-start" pb="8px">
                    <HStack>
                      <FaSmile />
                      <Text className={styles.eventHostMobile}>
                        Hosted by{" "}
                        <span>{event.hostName.toLocaleUpperCase()}</span>
                      </Text>
                    </HStack>
                    <HStack>
                      <FaMapMarkerAlt />
                      <Text className={styles.eventLocationMobile}>
                        {event.location
                          ? event.location.value.structured_formatting.main_text
                          : "TBD"}
                      </Text>
                    </HStack>
                  </VStack>
                  <Text className={styles.eventDescMobile}>
                    {event.description}
                  </Text>
                  {!ticketId ? (
                    <VStack alignItems="flex-start" pb="8px">
                      <Text className={styles.eventDescMobile}>
                        Tickets Remaining:{" "}
                        {event.maxTickets - Object.keys(event.attendees).length}
                        /{event.maxTickets}
                      </Text>
                      <Text className={styles.eventDescMobile}>
                        Cost per Ticket: {event.costPerTicket}
                      </Text>
                    </VStack>
                  ) : (
                    <VStack h="10px" />
                  )}
                </VStack>
                <VStack w="100%">
                  {needsVerification ? (
                    <Button
                      onClick={() => signMessage?.()}
                      className={styles.button}
                    >
                      Verify Access
                    </Button>
                  ) : !ticketId ? (
                    <Button
                      onClick={handleShowDrawer}
                      className={styles.button}
                    >
                      {isLoading ? <Spinner color="black" /> : "Buy Ticket"}
                    </Button>
                  ) : (
                    <Button onClick={handleFlip} className={styles.button}>
                      View ticket
                    </Button>
                  )}
                  {needsVerification && (
                    <Text className={styles.privateLabel}>
                      This is a private event. Please connect your wallet to
                      verify access.
                    </Text>
                  )}
                </VStack>
                <Drawer
                  placement="bottom"
                  onClose={onClose}
                  isOpen={isOpen}
                  autoFocus={false}
                >
                  <DrawerOverlay />
                  {txnHash ? (
                    <DrawerContent bgColor="black" borderRadius="20px">
                      <DrawerHeader borderBottomWidth="1px" border="none">
                        <Text className={styles.drawerHeader}>
                          Payment Status
                        </Text>
                      </DrawerHeader>
                      <DrawerBody>
                        <VStack gap={5} pb="10px">
                          <VStack className={styles.spinnerContainer}>
                            <SuccessLottie w={150} h={150} />
                            <Text fontSize="14px" pt="1rem">
                              Payment successful
                            </Text>
                          </VStack>
                        </VStack>
                        <VStack w="100%" p="1rem">
                          <Text
                            className={styles.poweredBy}
                            onClick={handleHiddenDisconnect}
                          >
                            Powered by <span className={styles.logo}>TIXO</span>
                          </Text>
                        </VStack>
                      </DrawerBody>
                    </DrawerContent>
                  ) : isLoading ? (
                    <DrawerContent bgColor="black" borderRadius="20px">
                      <DrawerHeader borderBottomWidth="1px" border="none">
                        <Text className={styles.drawerHeader}>
                          Payment Status
                        </Text>
                      </DrawerHeader>
                      <DrawerBody>
                        <VStack gap={5} pb="10px">
                          <VStack className={styles.spinnerContainer}>
                            <Spinner color="white" size="xl" />
                            <Text fontSize="14px" pt="1rem">
                              Payment processing...
                            </Text>
                          </VStack>
                        </VStack>
                        <VStack w="100%" p="1rem">
                          <Text
                            className={styles.poweredBy}
                            onClick={handleHiddenDisconnect}
                          >
                            Powered by <span className={styles.logo}>TIXO</span>
                          </Text>
                        </VStack>
                      </DrawerBody>
                    </DrawerContent>
                  ) : (
                    <DrawerContent bgColor="black" borderRadius="20px">
                      <DrawerHeader borderBottomWidth="1px" border="none">
                        <Text className={styles.drawerHeader}>
                          Choose payment method
                        </Text>
                      </DrawerHeader>
                      <DrawerBody>
                        <VStack gap={5} pb="10px">
                          <HStack
                            className={styles.drawerButton}
                            onClick={handleMintTicket}
                          >
                            <Image
                              src="/fantom1.png"
                              className={styles.fantom}
                            />
                            <Text className={styles.buttonLabel}>
                              Pay with FTM
                            </Text>
                          </HStack>
                          <HStack
                            className={styles.drawerButton}
                            onClick={handleStripeCheckout}
                          >
                            <Image src="/visa.png" className={styles.visa} />
                            <Text className={styles.buttonLabel}>
                              Pay with card
                            </Text>
                          </HStack>
                        </VStack>
                        <VStack w="100%" p="1rem">
                          <Text
                            className={styles.poweredBy}
                            onClick={handleHiddenDisconnect}
                          >
                            Powered by <span className={styles.logo}>TIXO</span>
                          </Text>
                        </VStack>
                      </DrawerBody>
                    </DrawerContent>
                  )}
                </Drawer>
              </VStack>
            ) : (
              <VStack className={styles.loadingContainer} gap={1}>
                <Spinner color="white" />
              </VStack>
            )}
          </VStack>
          <VStack w="100%" p="1rem" pt=".5rem">
            <Image src="/ticket.png" position="absolute" h="90vh" w="85vw" />
            {/* The back of the card */}
            {event ? (
              <VStack className={styles.contentContainer} gap={1}>
                <VStack w="100%" justifyContent="center">
                  <QRCode value={qrUrl} size={240} />
                </VStack>
                <Text className={styles.eventHeaderMobile}>EVENT:</Text>
                <Text className={styles.eventTitleMobile}>
                  {event.eventName}
                </Text>
                <Text className={styles.eventTicketNo}>
                  TICKET NO. {ticketId}
                </Text>
                <VStack alignItems="flex-start">
                  <Text className={styles.eventDateMobile}>
                    {format(
                      new Date(event.date ? event.date * 1000 : "2023-06-04"),
                      "eeee, MMMM do"
                    )}
                  </Text>
                  <Text className={styles.eventTimeMobile}>
                    {formattedTime}
                  </Text>
                </VStack>
                <VStack alignItems="flex-start">
                  <HStack>
                    <FaSmile />
                    <Text className={styles.eventHostMobile}>
                      Hosted by{" "}
                      <span>{event.hostName.toLocaleUpperCase()}</span>
                    </Text>
                  </HStack>
                  <HStack>
                    <FaMapMarkerAlt />
                    <Text className={styles.eventLocationMobile}>
                      {event.location
                        ? event.location.value.structured_formatting.main_text
                        : "TBD"}
                    </Text>
                  </HStack>
                </VStack>
                <Text className={styles.eventDescMobile}>
                  {event.description}
                </Text>
                <VStack h="10px" />
                <VStack w="100%" pt="10px">
                  <Button onClick={handleFlip} className={styles.button}>
                    Go back
                  </Button>
                </VStack>
              </VStack>
            ) : (
              <Text>Loading...</Text>
            )}
          </VStack>
        </ReactCardFlip>
      )}
      {isMobile && (
        <HStack className={styles.navbar}>
          <Text className={styles.poweredBy}>
            Powered by <span className={styles.logo}>TIXO</span>
          </Text>
        </HStack>
      )}
    </main>
  );
}

export default withTransition(EventPage);
