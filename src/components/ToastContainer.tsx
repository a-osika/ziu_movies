import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from 'framer-motion';

interface Toast {
  id: number;
  message: string;
}

interface Props {
  toasts: Toast[];
}

const toastVariants: Variants = {
  initial: {
    opacity: 0,
    x: 48,
    scale: 0.9,
  },

  animate: {
    opacity: 1,
    x: 0,
    scale: 1,

    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },

  exit: {
    opacity: 0,
    x: 48,
    scale: 0.85,

    transition: {
      duration: 0.18,
    },
  },
};

export function ToastContainer({ toasts }: Props) {
  return (
    <div className="toast-container">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="toast"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
