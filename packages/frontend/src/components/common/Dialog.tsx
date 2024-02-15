import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const Dialog = (
  props: React.PropsWithChildren<{
    modalClass?: string;
    isOpen: boolean;
    onClose: () => void;
    hasBackdropClose?: boolean;
    hasEscClose?: boolean;
  }>,
) => {
  const {
    children,
    hasBackdropClose,
    hasEscClose,
    isOpen,
    modalClass,
    onClose,
  } = props;
  const dialogModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogModalRef.current) {
      dialogModalRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.code === 'Escape' &&
        (event.target === document.body ||
          dialogModalRef.current === document.activeElement) &&
        isOpen &&
        hasEscClose
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, hasEscClose]);

  const handleBackdropClick = () => {
    if (hasBackdropClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-10 overflow-hidden"
          tabIndex={-1}
          ref={dialogModalRef}
          onClick={handleBackdropClick}
        >
          <div
            className={cn(
              'overflow-auto max-h-full max-w-full bg-white relative',
              modalClass,
            )}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Dialog;
