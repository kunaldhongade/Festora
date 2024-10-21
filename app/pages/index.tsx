import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "@styles/Home.module.css";
import { useAccount, useSigner } from "wagmi";
import {
  VStack,
  Input,
  Textarea,
  Switch,
  Button,
  Text,
  Spinner,
  HStack,
  Image,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link as ChakraLink,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { Event } from "@utils/types";
import { ethers } from "ethers";
import TixoProtocolV1 from "@data/TixoProtocolV1.json";
import Landing from "@components/Landing";
import { ImageContext, TIXO_API_URL } from "./_app";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SuccessLottie from "@components/SuccessLottie";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import withTransition from "@components/withTransition";

const NFT_ADDRESS = process.env.NEXT_PUBLIC_TIXO_ADDRESS;

function ImageSelector({ setBgImage }) {
  const images = ["/0.jpg", "/1.png", "/2.jpg", "/3.jpg"];
  const [uploadedBg, setUploadedBg] = useState<Blob>();

  function handleImageBg(e) {
    setUploadedBg(e.target.files[0]);
    setSelectedImage(URL.createObjectURL(e.target.files[0]));
  }

  const { setSelectedImage } = useContext(ImageContext);

  function handleSelectImage(image) {
    setBgImage(image);
    setSelectedImage(image);
  }

  return (
    <VStack className={styles.inputContainer}>
      <Text>Select background</Text>
      <HStack className={styles.bgContainer}>
        {!uploadedBg ? (
          <VStack className={styles.bgUploadContainer}>
            <input
              type="file"
              name="images"
              id="images"
              required
              multiple
              onChange={handleImageBg}
              className={styles.bgInput}
            />
            <VStack className={styles.bgInputText}>
              <Text fontSize="24px">+</Text>
            </VStack>
          </VStack>
        ) : (
          <VStack className={styles.bgUploadContainer}>
            <input
              type="file"
              name="images"
              id="images"
              required
              multiple
              onChange={handleImageBg}
              className={styles.bgInput}
            />
            <Image
              alt="preview"
              src={uploadedBg ? URL.createObjectURL(uploadedBg) : ""}
              className={styles.bgPreviewContainer}
            ></Image>
          </VStack>
        )}
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt=""
            onClick={() => handleSelectImage(image)}
            style={{ cursor: "pointer" }}
            className={styles.imageSelection}
          />
        ))}
      </HStack>
    </VStack>
  );
}

function App() {
  const { address } = useAccount();
  const { data: signer, isError } = useSigner();
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [hostName, setHostName] = useState("");
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxTickets, setMaxTickets] = useState(100);
  const [costPerTicket, setCostPerTicket] = useState(0);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [txnHash, setTxnHash] = useState("");
  const [eventId, setEventId] = useState("");
  const [showIcon, setShowIcon] = useState(true);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [uploadedImage, setUploadedImage] = useState<Blob>();
  const { setSelectedImage } = useContext(ImageContext);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isBottom = scrollTop + clientHeight >= scrollHeight;
      setShowIcon(!isBottom);
    };

    if (scrollContainer)
      scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollContainer)
        scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // maybe save metadata on-chain via IPFS
  const createEvent = async () => {
    setLoading(true);

    try {
      const contract = new ethers.Contract(
        NFT_ADDRESS,
        TixoProtocolV1.abi,
        signer
      );

      const lastEventIdBN = await contract.getLastEventId();

      const txnResult = await contract.createEvent(0, maxTickets);

      const eventDateTime = new Date(`${date}T${time}`);
      const timestamp = Math.floor(eventDateTime.getTime() / 1000);

      const event: Event = {
        eventName,
        description,
        hostName,
        hostId: address,
        location,
        date: timestamp,
        maxTickets,
        costPerTicket,
        tokenAddress,
        attendees: {},
        creationTxn: txnResult,
        eventId: String(lastEventIdBN.toNumber() + 1),
        bgImage,
      };

      const response = await axios.post(`${TIXO_API_URL}/createEvent`, event);

      setEventId(response.data.eventId);
      setSuccess(true);
      setTxnHash(txnResult.hash);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function handleImageUpload(e) {
    setUploadedImage(e.target.files[0]);
  }

  useEffect(() => {
    setSelectedImage("/0.jpg");
  }, []);

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

  if (!address) return <Landing />;

  if (isMobile)
    return (
      <main className={styles.main}>
        <Text textAlign="center">
          This page is only supported on desktop at the moment. Thank you for
          understanding.
        </Text>
      </main>
    );

  if (isSuccess)
    return (
      <main className={styles.main}>
        <Text>Event Created Successfully</Text>
        <Text className={styles.title}>{eventName}</Text>
        <SuccessLottie />
        <HStack>
          <Link href={`/event/${eventId}`}>
            <Button className={styles.button}>Go to event</Button>
          </Link>
          <ChakraLink href={`https://ftmscan.com/tx/${txnHash}`} isExternal>
            <Button className={styles.button}>View transaction</Button>
          </ChakraLink>
        </HStack>
      </main>
    );

  return (
    <main className={styles.main}>
      <VStack gap={5}>
        <HStack alignItems="flex-start" gap={10}>
          <VStack>
            <VStack
              height="600px"
              overflowY="scroll"
              ref={scrollContainerRef}
              gap={2}
            >
              <VStack className={styles.inputContainer}>
                <Text>Event Title</Text>
                <Input
                  className={styles.input}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                ></Input>
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Description</Text>
                <Textarea
                  className={styles.input}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Textarea>
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Hosted by</Text>
                <Input
                  className={styles.input}
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                ></Input>
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Location</Text>
                <GooglePlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}
                  selectProps={{
                    value: location,
                    onChange: setLocation,
                    styles: {
                      control: (base) => ({
                        ...base,
                        width: 350,
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "0.5px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 20,
                        color: "white",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: 0,
                        marginTop: 0,
                        color: "white",
                      }),
                      menuList: (base) => ({
                        ...base,
                        padding: 0,
                        color: "black",
                      }),
                    },
                  }}
                />
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Date</Text>
                <Input
                  type="date"
                  className={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                ></Input>
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Time</Text>
                <Input
                  type="time"
                  className={styles.input}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                ></Input>
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Number of Spots</Text>
                <Input
                  className={styles.input}
                  value={maxTickets}
                  onChange={(e) => setMaxTickets(Number(e.target.value))}
                ></Input>
              </VStack>
              <VStack className={styles.inputContainer}>
                <Text>Cost per ticket</Text>
                {/* <VStack position="relative"> */}
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children="$"
                  />
                  <Input
                    className={styles.input}
                    value={costPerTicket}
                    onChange={(e) => setCostPerTicket(Number(e.target.value))}
                  ></Input>
                  <InputRightElement w="200px" justifyContent="flex-end">
                    <Text color="rgba(255,255,255,0.5)" pr="20px">
                      {costPerTicket * 0.318} FTM
                    </Text>
                  </InputRightElement>
                  {/* </VStack> */}
                </InputGroup>
              </VStack>
              {isTokenGated && (
                <VStack className={styles.inputContainer}>
                  <Text>Token Contract Address</Text>
                  <Input
                    className={styles.input}
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                  ></Input>
                </VStack>
              )}
              <HStack className={styles.inputContainer} width="100%">
                <Text width="100%">Is Token Gated</Text>
                <Switch
                  isChecked={isTokenGated}
                  onChange={(e) => setIsTokenGated(e.target.checked)}
                ></Switch>
              </HStack>
            </VStack>
            {showIcon ? (
              <ChevronDownIcon
                boxSize={6}
                color="gray.500"
                alignSelf="center"
                marginBottom={4}
              />
            ) : (
              <VStack h="24px" />
            )}
          </VStack>
          <VStack gap={5}>
            {!uploadedImage ? (
              <VStack className={styles.inputContainer}>
                <Text>Image</Text>
                <VStack className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    name="images"
                    id="images"
                    required
                    multiple
                    onChange={handleImageUpload}
                    className={styles.imageInput}
                  />
                  <VStack className={styles.imageInputText}>
                    <Text className={styles.uploaderTitle3}>Upload image</Text>
                    <Text className={styles.uploaderTitle4}>
                      File types supported: jpg, png, svg
                    </Text>
                    <Text className={styles.uploaderSubtitle}>
                      Max size: 35MB
                    </Text>
                  </VStack>
                </VStack>
              </VStack>
            ) : (
              <VStack className={styles.inputContainer}>
                <Text>Image</Text>
                <VStack className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    name="images"
                    id="images"
                    required
                    multiple
                    onChange={handleImageUpload}
                    className={styles.imageInput}
                  />
                  <Image
                    alt="preview"
                    src={
                      uploadedImage ? URL.createObjectURL(uploadedImage) : ""
                    }
                    className={styles.previewContainer}
                  ></Image>
                </VStack>
              </VStack>
            )}
            <ImageSelector setBgImage={setBgImage} />
          </VStack>
        </HStack>
        <Button onClick={createEvent} className={styles.button}>
          {isLoading ? <Spinner color="white" /> : "Create Event"}
        </Button>
      </VStack>
    </main>
  );
}

export default withTransition(App);
