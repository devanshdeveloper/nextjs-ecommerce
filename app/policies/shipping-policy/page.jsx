const ShippingPolicy = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>
      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold">1. Shipping Timeline</h2>
          <p>
            We aim to process and ship your order within [Minimum and Maximum
            Timeline] working days.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Shipping Charges</h2>
          <p>
            Shipping charges are calculated at checkout and will vary based on
            the destination and shipping method selected.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Delivery Time</h2>
          <p>
            Delivery times are estimated and may vary depending on the
            destination and shipping method chosen.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
