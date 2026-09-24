import { useApp } from '../contexts/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
  const icon = toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : '⚠';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-fadeInUp">
      <div className={`${bgColor} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm`}>
        <span className="text-lg font-bold">{icon}</span>
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
}
