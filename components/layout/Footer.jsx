import React from "react";

function Footer() {
  return (
    <footer className="bg-background rounded-lg shadow m-4 ">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Bhrm Clothing
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          {[
            { href: "/policies/pricing", text: "Pricing" },
            { href: "/policies/privacy-policy", text: "Privacy Policy" },
            { href: "/policies/refunds-cancellations", text: "Refunds Cancellations" },
            { href: "/policies/shipping-policy", text: "Shipping Policy" },
            { href: "/policies/terms-and-conditions", text: "Terms and Conditions" },
            { href: "/contact-us", text: "Contact Us" },
          ].map((item, index) => {
            return (
              <li key={index}>
                <a href={item.href} className="hover:underline me-4 md:me-6">
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
