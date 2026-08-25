import LoadingScreen from "@/components/shows/loading-screen";

export default function ShowLoading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950">
      <LoadingScreen />
    </div>
  );
}
