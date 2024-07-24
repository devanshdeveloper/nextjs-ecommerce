const PrivacyPolicy = () => {
  return (
    <div className="flex justify-center">
      <div className="w-[min(80vw,900px)]">
        <h1 className="text-2xl font-bold my-4">Privacy Policy</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              Your privacy is important to us. This privacy policy explains how
              we collect, use, and protect your personal information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p>
              We use the information to provide, maintain, and improve our
              services, and to communicate with you.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">4. Sharing of Information</h2>
            <p>
              We do not share your personal information with third parties
              except as described in this policy.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p>
              We implement security measures to protect your information.
              However, no electronic storage method is 100% secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
