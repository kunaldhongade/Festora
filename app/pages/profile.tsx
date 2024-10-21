import { useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { Event } from "@utils/types";
import styles from "@styles/Home.module.css";
import Link from "next/link";
import { TIXO_API_URL } from "./_app";

export default function Profile() {
  const { address } = useAccount();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (address) {
        try {
          const res = await axios.get(
            `${TIXO_API_URL}/event/address/${address}`
          );
          setEvents(res.data.events);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchEvents();
  }, [address]);

  return (
    <main className={styles.main}>
      <h2>Events</h2>
      {events && events.length > 0 ? (
        <ul>
          {events.map((event, index) => (
            <Link href={`/event/${event.eventId}`} key={event.eventId}>
              <li>
                <h3>{event.eventName}</h3>
                <p>{event.description}</p>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No events found</p>
      )}
    </main>
  );
}
