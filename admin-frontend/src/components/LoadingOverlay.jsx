export default function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <span className="loading loading-bars loading-xl text-white"></span>
    </div>
  );
}
