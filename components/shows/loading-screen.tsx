import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-500 animate-bounce">
        <Image
          src="/assets/icon-play.svg"
          width={16}
          height={16}
          alt=""
          className="ml-0.5"
        />
      </div>
      <p className="text-preset-4 text-blue-500">Loading…</p>
    </div>
  );
}
