import Image from "next/image";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-14 px-4">
      <Image
        src="/assets/logo.svg"
        alt="Entertainment App"
        width={32}
        height={26}
      />
      {children}
    </div>
  );
}
