interface PhoneLinkProps {
  children: React.ReactNode;
  className?: string;
  phoneNumber?: string;
  /** Kept for source-compatibility with existing call sites; no longer used. */
  label?: string;
}

export function PhoneLink({
  children,
  className,
  phoneNumber = "08003162922",
}: PhoneLinkProps) {
  const normalizedNumber = phoneNumber.replace(/\D/g, "");

  return (
    <a href={`tel:${normalizedNumber}`} className={className}>
      {children}
    </a>
  );
}
