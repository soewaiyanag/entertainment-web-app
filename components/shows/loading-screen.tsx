import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="relative size-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/assets/icon-play.svg" width={14} height={14} alt="" />
        </div>
      </div>
      <p className="text-preset-4 text-blue-500">Loading…</p>
    </div>
  );
}
