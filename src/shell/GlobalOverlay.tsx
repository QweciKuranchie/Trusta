/**
 * GlobalOverlay — Full-screen processing overlay.
 *
 * Non-dismissible overlay shown during transfer execution.
 * Blocks all interaction (REQ-5.6, REQ-6.6).
 */

import React from 'react';
import { Spinner } from '../components/Spinner';

interface GlobalOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const GlobalOverlay: React.FC<GlobalOverlayProps> = ({
  isVisible,
  message = 'Processing your transfer…',
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex flex-col items-center justify-center gap-4
        bg-surface-900/60 dark:bg-surface-950/80
        backdrop-blur-sm
        animate-fade-in
      "
      role="alertdialog"
      aria-modal="true"
      aria-label="Processing transfer"
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/90 dark:bg-surface-800/90 shadow-overlay backdrop-blur-md">
        <Spinner size="lg" className="text-brand-600 dark:text-brand-400" />
        <p className="text-sm font-medium text-surface-700 dark:text-surface-200">
          {message}
        </p>
      </div>
    </div>
  );
};
