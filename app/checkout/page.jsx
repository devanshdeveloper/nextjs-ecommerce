"use client";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { createOneAddress, readByUserIdAddress, updateOneAddress } from "@/fetch/address";
import { defaultCheckoutFormValue } from "@/utils/defaultFormValue";
import parseError from "@/utils/parseError";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useEffect, useRef, useState } from "react";

function CheckoutPage() {
  const [checkoutForm, setCheckoutForm] = useState(defaultCheckoutFormValue());
  const { user } = useAuthContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const streetTextareaRef = useRef(null);

  const [errors, setErrors] = useState([]);

  const { data: userAddresses } = useQuery({
    queryKey: ["address", user._id],
    queryFn: async () => {
      const addresses = await readByUserIdAddress({ userId: user._id });
      return addresses;
    },

    refetchOnWindowFocus: false,
    retry: false,
  });

  console.log(userAddresses);

  const mutate_address = useMutation({
    mutationFn: async () => {
      if (selectedAddress) {
        return await updateOneAddress({
          id: selectedAddress,
          newAddress: checkoutForm,
        });
      } else {
        return await createOneAddress({
          ...checkoutForm,
          user: user._id,
        });
      }
    },
    onSuccess: (data) => {
      console.log(data);
      setCheckoutForm(defaultCheckoutFormValue());
    },
  });

  useEffect(() => {
    streetTextareaRef.current.style.height = "130px !important";
  }, []);
  useEffect(() => {
    if (!selectedAddress) return;
    const newAddress = userAddresses.find(
      (address) => address._id === selectedAddress
    );
    setCheckoutForm({
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      phoneNo: newAddress.phoneNo,
      zipCode: newAddress.zipCode,
      country: newAddress.country,
    });
  }, [selectedAddress, userAddresses]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {}}
      />
      <div className="flex justify-center">
        <div className="w-[min(900px,80vw)] flex flex-col gap-5 pt-5">
          <div className="text-2xl lg:text-5xl">Address Info</div>
          <div className="flex flex-wrap gap-2">
            {userAddresses &&
              userAddresses.map((address) => {
                return (
                  <Button
                    key={address._id}
                    variant="bordered"
                    isDisabled={selectedAddress === address._id}
                    onClick={() => setSelectedAddress(address._id)}
                    className="text-wrap h-auto py-2"
                    isSelected={address._id === selectedAddress}
                  >
                    {`${address.street}, ${address.city}, ${address.state}`}
                  </Button>
                );
              })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate_address.mutate();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row gap-4 h-full">
              <Textarea
                isDisabled={mutate_address.isPending}
                type="text"
                label="Street"
                name="street"
                classNames={{
                  inputWrapper: "!h-[130px]",
                  base: "!h-[130px] w-full md:w-1/2",
                }}
                ref={streetTextareaRef}
                onValueChange={(value) =>
                  setCheckoutForm({ ...checkoutForm, street: value })
                }
                value={checkoutForm.street}
                isRequired
              />
              <div className="flex flex-col gap-4 w-full md:w-1/2">
                <Input
                  isDisabled={mutate_address.isPending}
                  type="text"
                  label="City"
                  name="city"
                  className="w-full"
                  onValueChange={(value) =>
                    setCheckoutForm({ ...checkoutForm, city: value })
                  }
                  value={checkoutForm.city}
                  isRequired
                />
                <Input
                  isDisabled={mutate_address.isPending}
                  type="text"
                  label="State"
                  name="state"
                  className="w-full"
                  onValueChange={(value) =>
                    setCheckoutForm({ ...checkoutForm, state: value })
                  }
                  value={checkoutForm.state}
                  isRequired
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                isDisabled={mutate_address.isPending}
                type="text"
                label="Pin Code"
                name="zipCode"
                onValueChange={(value) =>
                  setCheckoutForm({ ...checkoutForm, zipCode: value })
                }
                value={checkoutForm.zipCode}
                isRequired
              />
              <Input
                isDisabled={mutate_address.isPending}
                type="text"
                label="Country"
                name="country"
                onValueChange={(value) =>
                  setCheckoutForm({ ...checkoutForm, country: value })
                }
                value={checkoutForm.country}
                isRequired
              />
            </div>
            <Input
              isDisabled={mutate_address.isPending}
              type="number"
              label="Phone Number"
              name="phoneNo"
              onValueChange={(value) =>
                setCheckoutForm({ ...checkoutForm, phoneNo: value })
              }
              value={checkoutForm.phoneNo}
              isRequired
            />
            <Button
              isLoading={mutate_address.isPending}
              variant="flat"
              className="px-10 py-7 text-md"
              color="primary"
              type="submit"
            >
              Proceed to payment
            </Button>
            {mutate_address.error && (
              <span className="text-red-500">
                {parseError(mutate_address.error)}
              </span>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
