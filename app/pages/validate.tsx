import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, Spinner, Text, Image, VStack, HStack } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import SuccessLottie from "@components/SuccessLottie";
import FailureLottie from "@components/FailureLottie";
import { Event } from "@utils/types";
import { TIXO_API_URL } from "./_app";

export default function ValidateTicket() {
  const router = useRouter();
  const [validationStatus, setValidationStatus] = useState(
    "Validating ticket..."
  );
  const { eventId, ticketId, address } = router.query;
  const [event, setEvent] = useState<Event | null>(null);

  const isTicketValid = useMemo(() => {
    if (event) return event.attendees[address as string].status === "unused";
  }, [event, address]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const res = await axios.get(`${TIXO_API_URL}/event/id/${eventId}`);
          setEvent(res.data.event);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const validateTicket = async () => {
      if (eventId && ticketId && address) {
        try {
          const response = await axios.post(`${TIXO_API_URL}/validateTicket`, {
            eventId: eventId as string,
            ticketId: ticketId as string,
            address: address as string,
          });

          if (response.data.message === "Ticket validated successfully") {
            setValidationStatus("Ticket validated.");
          } else {
            setValidationStatus("Ticket validation failed.");
          }
        } catch (error) {
          console.error(error);
          setValidationStatus("Ticket validation failed.");
        }
      }
    };

    validateTicket();
  }, [router.query]);

  return (
    <VStack w="100%" p="1rem">
      <Image src="/ticket.png" position="absolute" h="85vh" w="85vw" />
      <VStack className={styles.verifiedContentContainer} gap={1}>
        {!event ? (
          <VStack>
            {validationStatus === "Validating ticket..." ? <Spinner /> : null}
            <Text>{validationStatus}</Text>
          </VStack>
        ) : (
          <VStack w="100%" alignItems="center">
            <Text textAlign="center" w="100%">
              {isTicketValid ? "TICKET VERIFIED" : "INVALID TICKET"}
            </Text>
            <VStack w="100%" alignItems="center">
              {isTicketValid ? (
                <SuccessLottie h={240} w={240} />
              ) : (
                <FailureLottie h={240} w={240} />
              )}
            </VStack>
            <VStack alignItems="flex-start">
              <Text className={styles.eventHeaderMobile}>EVENT:</Text>
              <Text className={styles.eventTitleMobile}>{event.eventName}</Text>
              <Text className={styles.eventTicketNo}>
                TICKET NO. {ticketId}
              </Text>
              <Text fontSize="14px" lineHeight="20px">
                This ticket has previously been marked as "used". It is no
                longer a valid ticket for event entry.
              </Text>
            </VStack>
          </VStack>
        )}
      </VStack>
      <HStack className={styles.navbar} bottom={1}>
        <Text className={styles.poweredBy}>
          Powered by <span className={styles.logo}>TIXO</span>
        </Text>
      </HStack>
    </VStack>
  );
}
