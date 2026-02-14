export default function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-4 border-red-500 border-solid rounded-full animate-spin animate-pulse"></div>
      </div>
    </div>
  );
}
