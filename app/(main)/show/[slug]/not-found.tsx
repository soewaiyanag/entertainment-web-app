import Link from "next/link";

export default function ShowNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
      <h1 className="text-preset-1 text-white">Title not found</h1>
      <p className="text-preset-4 text-blue-500 max-w-sm">
        We couldn&apos;t find this movie or TV series. It may have been
        removed or the link is incorrect.
      </p>
      <Link
        href="/"
        className="text-preset-4 text-red-500 hover:underline mt-2"
      >
        Back to Home
      </Link>
    </div>
  );
}
