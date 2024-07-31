import { Button, Divider, Input, Spinner } from "@nextui-org/react";
import React, { forwardRef, useEffect, useState } from "react";
import { useAuthContext } from "./providers/AuthProvider";
import parseAmount from "@/utils/parseAmount";
import promoCodes from "@/utils/PromoCodes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateOneUser } from "@/fetch/user";

const CartFooter = forwardRef(
  ({ products, hasNextPage, fetchNextPage, isFetching , user , setUser }, ref) => {
    
    const router = useRouter();
    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [showPartGIF, setShowPartyGIF] = useState(false);
    const [appliedPromoCode, setAppliedPromoCode] = useState({
      code: "",
      message: "",
    });
    const [amounts, setAmounts] = useState({
      finalAmount: 0,
      totalAmount: 0,
      discount: 0,
      shippingCharges: 100,
      subTotalAmount: 0,
      discountAmount: 0,
    });

    const applyPromoCode = (promoCode = promoCodeInput) => {
      promoCodes.forEach((promoCodeItem) => {
        if (promoCodeItem.code === promoCode) {
          if (promoCodeItem.isPromoCodeValid(user)) {
            setShowPartyGIF(true);
            setTimeout(() => setShowPartyGIF(false), 3000);
            const appliedResult = promoCodeItem.applyPromoCode();
            calculateAmounts(user?.cart, products, appliedResult.discount);
            setAppliedPromoCode({
              code: promoCodeItem.code,
              message: appliedResult.message,
            });
            return;
          }
        }
      });
    };

    function calculateAmounts(cart, products, discount = amounts.discount) {
      if (!cart || !products) return 0;
      let amount = 0;
      let notFoundProducts = [];
      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const product = products.find((p) => p._id === cartItem.product);
        if (!product) {
          notFoundProducts.push(cartItem.product);
          continue;
        }
        amount += product.price * cartItem.quantity;
      }
      if (notFoundProducts.length) {
        const newCart = user?.cart.filter(
          (cartProduct) => !notFoundProducts.includes(cartProduct.product)
        );
        setUser({ ...user, cart: newCart });
        updateOneUser({ id: user._id, newUser: { cart: newCart } });
      }
      const discountAmount = amount * discount;
      setAmounts({
        // finalAmount: amount,
        totalAmount: amount + amounts.shippingCharges - discountAmount,
        discount,
        discountAmount,
        subTotalAmount: amount,
        shippingCharges: amounts.shippingCharges,
      });
    }

    useEffect(() => {
      calculateAmounts(user?.cart, products);
    }, [user?.cart, products]);

    return (
      <div className="flex flex-col items-center gap-10 mt-10 px-10">
        {!isFetching && (
          <div className="flex flex-col gap-5 w-[min(85vw,600px)]">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{parseAmount(amounts.subTotalAmount)}</span>
              </div>
              {amounts.discountAmount !== 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {parseAmount(amounts.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{parseAmount(amounts.shippingCharges)}</span>
              </div>
              <div className="border-t border-gray-300 mt-2 pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{parseAmount(amounts.totalAmount)}</span>
                </div>
              </div>
            </div>
            <form
              className="flex gap-3 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                applyPromoCode();
              }}
            >
              <div className="flex flex-col gap-2 w-full">
                <Input
                  type="text"
                  isDisabled={appliedPromoCode.code}
                  placeholder="Promo Code"
                  value={promoCodeInput}
                  onValueChange={(value) => setPromoCodeInput(value)}
                />
                <span className="ml-2 text-foreground-500  text-xs md:text-sm">
                  {appliedPromoCode.message}
                </span>
              </div>
              <Button
                variant="flat"
                color="primary"
                isDisabled={appliedPromoCode.code}
                className="px-10"
                onPress={applyPromoCode}
              >
                Apply Promo Code
              </Button>
            </form>
            <div className="flex flex-col gap-2">
              <h3 className="px-2">Available Promo Codes</h3>
              {promoCodes.map((promoCode, i) => (
                <div
                  className="flex items-center justify-between py-3 px-5 bg-foreground-100 rounded-lg"
                  key={i}
                >
                  <div>
                    <div>{promoCode.code}</div>
                    <div className="text-foreground-500  text-xs md:text-sm">
                      {promoCode.message}
                    </div>
                  </div>
                  <Button
                    variant="flat"
                    color="primary"
                    type="button"
                    isDisabled={
                      promoCode.isPromoCodeValid(user?.id) ||
                      appliedPromoCode.code === promoCode.code
                    }
                    onPress={() => {
                      setPromoCodeInput(promoCode.code);
                      applyPromoCode(promoCode.code);
                    }}
                  >
                    {`Apply`}
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="flat"
              color="primary"
              size="lg"
              type="button"
              onPress={() => router.push("/checkout")}
            >
              {`Continue to Checkout`}
            </Button>
          </div>
        )}
        <div className="h-full flex items-center justify-center" ref={ref}>
          {hasNextPage && (
            <Button
              variant="flat"
              color="primary"
              size="lg"
              isLoading={isFetching}
              onPress={fetchNextPage}
            >
              Load More
            </Button>
          )}
          {!hasNextPage && isFetching && <Spinner />}
        </div>
        {showPartGIF && (
          <div className="absolute bottom-0 left-0">
            <Image
              src={`/congratulations.gif`}
              alt={"congratulations"}
              width={200}
              height={200}
              className="w-full h-screen"
            />
          </div>
        )}
      </div>
    );
  }
);
CartFooter.displayName = "CartFooter";

export default CartFooter;
