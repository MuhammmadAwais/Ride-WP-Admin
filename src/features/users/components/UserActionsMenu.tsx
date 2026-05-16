import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, UserMinus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ROUTES } from '@/Constants';

interface UserActionsMenuProps {
  userId: string;
}

export function UserActionsMenu({ userId }: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'suspend' | 'delete' | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle menu positioning
  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.right - 192, // 192 is w-48
      });
    }
    setIsOpen(!isOpen);
  };

  // Close menu on click outside or scroll
  useEffect(() => {
    const handleClose = (e: Event) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClose);
      window.addEventListener('scroll', () => setIsOpen(false), true);
      window.addEventListener('resize', () => setIsOpen(false));
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClose);
      window.removeEventListener('scroll', () => setIsOpen(false), true);
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, [isOpen]);

  const handleViewDetail = () => {
    setIsOpen(false);
    navigate(`${ROUTES.USERS}/${userId}`);
  };

  const handleAction = (type: 'suspend' | 'delete') => {
    setIsOpen(false);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="flex items-center justify-center">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 rounded-md hover:bg-accent/10 transition-colors text-text-muted hover:text-accent"
        aria-label="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={menuRef}
          className="fixed w-48 bg-surface backdrop-blur-xl border border-border rounded-xl shadow-2xl z-[300] overflow-hidden"
          style={{ 
            top: menuPosition.top, 
            left: menuPosition.left,
            animation: 'fade-in 0.2s ease-out' 
          }}
        >
          <button onClick={handleViewDetail} className="w-full text-left px-4 py-2.5 text-sm font-poppins text-text-main/80 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-colors">
            <Eye size={16} className="text-accent" />
            View user Detail
          </button>
          <button onClick={() => handleAction('suspend')} className="w-full text-left px-4 py-2.5 text-sm font-poppins text-text-main/80 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-colors">
            <UserMinus size={16} className="text-yellow-500" />
            Suspend user
          </button>
          <button onClick={() => handleAction('delete')} className="w-full text-left px-4 py-2.5 text-sm font-poppins text-text-main/80 hover:bg-red-500/10 hover:text-red-500 flex items-center gap-3 transition-colors">
            <Trash2 size={16} className="text-red-500" />
            Delete user
          </button>
        </div>,
        document.getElementById('modal-root') || document.body
      )}

      {modalType && (
        <ActionModal 
          type={modalType} 
          onClose={closeModal} 
          onConfirm={() => {
            console.log(`${modalType} confirmed for user ${userId}`);
            closeModal();
          }} 
        />
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function ActionModal({ type, onClose, onConfirm }: { type: 'suspend' | 'delete', onClose: () => void, onConfirm: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(cardRef.current,
      { scale: 0.88, opacity: 0, y: 24 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }
    );
  });

  const handleCancel = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(cardRef.current, { scale: 0.92, opacity: 0, y: 12, duration: 0.2, onComplete: onClose });
  };

  const isDelete = type === 'delete';
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div ref={overlayRef} className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={handleCancel} />
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-[400px] rounded-[24px] bg-surface border border-border shadow-[0_24px_60px_rgba(0,0,0,0.2)] p-[36px_32px] text-center"
      >
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center bg-accent/10 border border-accent/20">
          {isDelete ? <Trash2 size={28} className="text-accent" /> : <UserMinus size={28} className="text-accent" />}
        </div>
        
        <h3 className="font-poppins font-bold text-[20px] text-text-main mb-2">
          {isDelete ? 'Delete this user?' : 'Suspend this user?'}
        </h3>
        <p className="font-roboto text-[14px] text-text-muted leading-relaxed mb-7">
          {isDelete 
            ? 'This action will permanently delete the user and all associated data.' 
            : 'This user will be temporarily suspended from accessing the platform.'}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-poppins font-semibold text-[14px] text-white bg-accent hover:bg-accent/90 transition-colors shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)]"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-xl font-poppins font-semibold text-[14px] text-text-main bg-transparent border border-border hover:bg-surface/50 transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
