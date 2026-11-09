import React from "react";
import { CheckCircle2, AlertTriangle, Info, Loader2, X, ExternalLink } from "lucide-react";
import { ToastMessage } from "../lib/types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isError = toast.type === "error";
        const isSuccess = toast.type === "success";
        const isLoading = toast.type === "loading";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-4 shadow-2xl border transition-all duration-300 transform translate-y-0 backdrop-blur-xl ${
              isError
                ? "bg-[#1E1214]/95 border-red-500/40 text-red-200"
                : isSuccess
                ? "bg-[#101A15]/95 border-emerald-500/40 text-emerald-100"
                : isLoading
                ? "bg-[#191D24]/95 border-[#FF6B35]/50 text-white"
                : "bg-[#191D24]/95 border-[#262C36] text-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {isLoading && <Loader2 className="w-5 h-5 text-[#FF6B35] animate-spin" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertTriangle className="w-5 h-5 text-red-400" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
              </div>

              <div className="flex-1 text-sm">
                <p className="font-semibold">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs mt-1 text-[#A1A6AF] break-words leading-relaxed">
                    {toast.message}
                  </p>
                )}
                {toast.txHash && (
                  <a
                    href={`https://scan.bohr.life/tx/${toast.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#FF6B35] hover:text-[#F5B942] underline mt-2 font-medium"
                  >
                    View on Bohr Scan <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#A1A6AF] hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

