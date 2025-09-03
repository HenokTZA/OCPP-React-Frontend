import { useTheme } from "@/lib/theme";

const ModalButton = ({ onCancel, onSave }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="flex justify-end gap-3">
      <button 
        className={`px-4 py-2 rounded-lg text-button-md transition-colors ${
          isDark
            ? "bg-dark-bg-secondary text-dark-text-secondary hover:bg-interactive-hover-dark hover:text-dark-text-primary"
            : "bg-light-bg-tertiary text-light-text-secondary hover:bg-interactive-hover-light hover:text-light-text-primary"
        }`}
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className={`px-4 py-2 rounded-lg text-button-md transition-colors ${
          isDark
            ? "bg-gradient-primary text-black hover:opacity-90"
            : "bg-gradient-primary-light text-white hover:opacity-90"
        }`}
        onClick={onSave}
      >
        Save
      </button>
    </div>
  );
};

export default ModalButton;
