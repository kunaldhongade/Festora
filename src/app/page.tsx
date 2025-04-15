import { EventList } from "@/components/event-list";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="lg:text-3xl md:text-2xl text-lg font-bold">
            Upcoming Events
          </h2>
        </div>
        <EventList />
      </div>
    </main>
  );
}

// export default function Home() {
//   const[amount, setAmount] = useState<number>(0);
//   const createOrder = async () => {
//     const res = await fetch("/api/create-order", {
//       method: "POST",
//       body: JSON.stringify({ amount }),
//     });
//     const data= await res.json();
//     const orderDetails = {
//       Key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       order_id: data.id,
//     };
//   };

//   return (
//     <div>
//       <Script
//         type="text/javascript"
//         src="https://checkout.razorpay.com/v1/checkout.js"
//       />
//       <input type="number" placeholder="enter" id="" />
//       <button>create order</button>
//     </div>
//   );
// }
