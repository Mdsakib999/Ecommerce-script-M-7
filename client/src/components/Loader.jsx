export default function Loader({ fullPage = false, className = "" }) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4 z-50">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className={`p-12 flex items-center justify-center z-50 ${className}`}>
      {loaderContent}
    </div>
  );
}
