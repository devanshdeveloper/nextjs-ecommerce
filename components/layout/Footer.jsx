import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="flex flex-wrap flex-col md:flex-row p-5 gap-5 bg-background justify-between">
        <span className="text-sm text-foreground-400">
          © 2024{" "}
          <Link href="/" className="hover:underline">
            Bhrm Clothing
          </Link>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center text-sm font-medium text-foreground-400 gap-2">
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
                <Link href={item.href} className="hover:underline me-4 md:me-6">
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
    </footer>
  );
}

export default Footer;
