const promoCodes = [
  {
    code: "FIRST10",
    message: "10% discount on first purchase",
    isPromoCodeValid(user) {
      return user?.orders?.length === 0;
    },
    applyPromoCode() {
      return {
        discount : 0.1,
        message: "10% discount on first purchase applied",
      };
    },
  },
];
export default promoCodes;
