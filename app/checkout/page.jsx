"use client";
import { defaultCheckoutFormValue } from "@/utils/defaultFormValue";
import { Input } from "@nextui-org/react";
// async function handleCheckout() {
//   const {
//     data: { key },
//   } = await axios.get("http://www.localhost:4000/api/getkey");

//   const {
//     data: { order },
//   } = await axios.post("http://localhost:4000/api/checkout", {
//     amount,
//   });

//   const options = {
//     key,
//     amount: order.amount,
//     currency: "INR",
//     name: "6 Pack Programmer",
//     description: "Tutorial of RazorPay",
//     image: "https://avatars.githubusercontent.com/u/25058652?v=4",
//     order_id: order.id,
//     callback_url: "http://localhost:4000/api/paymentverification",
//     prefill: {
//       name: "Gaurav Kumar",
//       email: "gaurav.kumar@example.com",
//       contact: "9999999999",
//     },
//     notes: {
//       address: "Razorpay Corporate Office",
//     },
//     theme: {
//       color: "#121212",
//     },
//   };
//   const razor = new window.Razorpay(options);
//   razor.open();
// }

// street: {
//   type: String,
//   required: true,
// },
// city: {
//   type: String,
//   required: true,
// },
// state: {
//   type: String,
//   required: true,
// },
// phoneNo: {
//   type: String,
//   required: true,
// },
// zipCode: {
//   type: String,
//   required: true,
// },
// country: {
//   type: String,
//   required: true,
// },

// user: {
//   type: mongoose.Schema.Types.ObjectId,
//   required: true,
//   ref: "User",
// },

// createdAt: {
//   type: Date,
//   default: Date.now,
// },

import Script from "next/script";
import { useState } from "react";

function CheckoutPage() {
  const [checkoutForm, setCheckoutForm] = useState(defaultCheckoutFormValue());
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {}}
      />
      <div className="flex justify-center">
        <div className="w-[min(900px,80vw)]">
          <div className="text-2xl lg:text-5xl py-5 lg:py-10">Address Info</div>
          <form>
            <Input />
          </form>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
