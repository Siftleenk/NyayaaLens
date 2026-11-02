import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context';
import type { Notification } from '../types';

function NotificationItem({ n }: { n: Notification }) {
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  };

  const borders = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
    warning: 'border-l-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={`flex items-start gap-3 bg-white rounded-xl p-4 shadow-lg border border-[#E8E6DF] border-l-4 ${borders[n.type]} max-w-sm`}
    >
      {icons[n.type]}
      <p className="text-sm text-[#172033] font-medium flex-1 leading-snug">{n.message}</p>
    </motion.div>
  );
}

export default function NotificationStack() {
  const { notifications } = useApp();
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {notifications.map(n => (
          <NotificationItem key={n.id} n={n} />
        ))}
      </AnimatePresence>
    </div>
  );
}
