import { useEffect } from "react";
import { X } from "lucide-react";

// Generic modal shell. Usage:
// <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
//   ...content...
// </Modal>
export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/40 cursor-default"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-xl p-6`}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}