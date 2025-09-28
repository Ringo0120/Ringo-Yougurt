export default function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <span className="loading loading-bars loading-xl text-white"></span>
    </div>
  );
}
