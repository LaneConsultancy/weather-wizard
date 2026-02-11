"use client";

import { trackPhoneClickConversion } from "@/components/google-ads";
import { trackPhoneClick } from "@/components/microsoft-uet";

interface PhoneLinkProps {
  children: React.ReactNode;
  className?: string;
  phoneNumber?: string;
  label?: string;
}

// Google Ads conversion label for phone clicks.
// Replace with the real label from Step 1 once the conversion action is created.
const PHONE_CLICK_CONVERSION_LABEL = "e9c-CLC-7fYbEIz3ucdA";

export function PhoneLink({
  children,
  className,
  phoneNumber = "08003162922",
  label = "phone",
}: PhoneLinkProps) {
  // Strip anything that isn't a digit from the phone number for the tel: href
  const normalizedNumber = phoneNumber.replace(/\D/g, "");

  const handleClick = () => {
    try {
      trackPhoneClickConversion(PHONE_CLICK_CONVERSION_LABEL, phoneNumber);
    } catch (error) {
      console.warn("[PhoneLink] Google Ads tracking failed:", error);
    }

    try {
      trackPhoneClick(label);
    } catch (error) {
      console.warn("[PhoneLink] Microsoft UET tracking failed:", error);
    }
  };

  return (
    <a
      href={`tel:${normalizedNumber}`}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
