import { useTheme } from "@/lib/theme";

const Modal = ({ children, onClose }) => {
  const { isDark } = useTheme();

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // only close when clicking the backdrop itself
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`max-h-[90vh] w-[34rem] overflow-y-auto rounded-xl shadow-xl p-4 animate-fade-in ${
          isDark
            ? "bg-zinc-900 border border-zinc-800"
            : "bg-light-bg-primary border border-light-border-secondary"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
