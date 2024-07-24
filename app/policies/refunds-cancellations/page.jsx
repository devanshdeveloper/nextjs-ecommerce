const RefundsCancellations = () => {
  return (
    <div className="flex justify-center">
      <div className="w-[min(80vw,900px)]">
        <h1 className="text-2xl font-bold my-4">Refunds/Cancellations</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold">1. No Refund Policy</h2>
            <p>
              Please note that all sales are final. We do not offer refunds or
              cancellations for any products or services purchased through our
              website.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Exception</h2>
            <p>
              In case of any issues or concerns with your purchase, please
              contact our support team at [Your Support Email] within 24 hours
              of purchase for assistance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundsCancellations;
