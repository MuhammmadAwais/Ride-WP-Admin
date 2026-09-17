import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, ShieldOff, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import { ROUTES } from '@/Constants';
import { useSuspendClubMutation, useDeleteClubMutation } from '../api/clubApi';

export interface ClubActionsMenuProps {
  clubId: string | number;
  isSuspended?: boolean;
  clubName?: string;
  onDeleteSuccess?: () => void;
}

export function ClubActionsMenu({
  clubId,
  isSuspended = false,
  clubName = 'Club',
  onDeleteSuccess,
}: ClubActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'suspend' | 'unsuspend' | 'delete' | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [suspendClub, { isLoading: isSuspending }] = useSuspendClubMutation();
  const [deleteClub, { isLoading: isDeleting }] = useDeleteClubMutation();

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
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
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
    navigate(`${ROUTES.CLUBS}/${clubId}`);
  };

  const handleAction = (type: 'suspend' | 'unsuspend' | 'delete') => {
    setIsOpen(false);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  const handleConfirm = async () => {
    try {
      const numericId = Number(clubId);
      if (modalType === 'suspend') {
        await suspendClub({ clubId: numericId, isSuspended: true }).unwrap();
        toast.success(`${clubName} suspended successfully.`);
      } else if (modalType === 'unsuspend') {
        await suspendClub({ clubId: numericId, isSuspended: false }).unwrap();
        toast.success(`${clubName} unsuspended successfully.`);
      } else if (modalType === 'delete') {
        await deleteClub({ clubId: numericId }).unwrap();
        toast.success(`${clubName} deleted successfully.`);
        onDeleteSuccess?.();
      }
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        data?: { message?: string; error?: string };
      };
      const msg =
        errorObj?.data?.message ||
        errorObj?.data?.error ||
        errorObj?.message ||
        'Action failed. Please try again.';
      toast.error(msg);
    } finally {
      closeModal();
    }
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

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed w-48 bg-surface backdrop-blur-xl border border-border rounded-xl shadow-2xl z-[300] overflow-hidden"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              animation: 'fade-in 0.2s ease-out',
            }}
          >
            <button
              onClick={handleViewDetail}
              className="w-full text-left px-4 py-2.5 text-sm font-poppins text-text-main/80 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-colors"
            >
              <Eye size={16} className="text-accent" />
              View club Detail
            </button>

            {isSuspended ? (
              <button
                onClick={() => handleAction('unsuspend')}
                className="w-full text-left px-4 py-2.5 text-sm font-poppins text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-3 transition-colors"
              >
                <ShieldCheck size={16} className="text-emerald-500" />
                Unsuspend club
              </button>
            ) : (
              <button
                onClick={() => handleAction('suspend')}
                className="w-full text-left px-4 py-2.5 text-sm font-poppins text-amber-500 hover:bg-amber-500/10 flex items-center gap-3 transition-colors"
              >
                <ShieldOff size={16} className="text-amber-500" />
                Suspend club
              </button>
            )}

            <button
              onClick={() => handleAction('delete')}
              className="w-full text-left px-4 py-2.5 text-sm font-poppins text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
            >
              <Trash2 size={16} className="text-red-500" />
              Delete club
            </button>
          </div>,
          document.getElementById('modal-root') || document.body
        )}

      {modalType && (
        <ActionModal
          type={modalType}
          clubName={clubName}
          onClose={closeModal}
          onConfirm={handleConfirm}
          isLoading={isSuspending || isDeleting}
        />
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function ActionModal({
  type,
  clubName,
  onClose,
  onConfirm,
  isLoading,
}: {
  type: 'suspend' | 'unsuspend' | 'delete';
  clubName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
    gsap.fromTo(
      cardRef.current,
      { scale: 0.88, opacity: 0, y: 24 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }
    );
  });

  const handleCancel = () => {
    if (isLoading) return;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(cardRef.current, {
      scale: 0.92,
      opacity: 0,
      y: 12,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  const isDelete = type === 'delete';
  const isUnsuspend = type === 'unsuspend';
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={handleCancel}
      />
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-[420px] rounded-[24px] bg-surface border border-border shadow-[0_24px_60px_rgba(0,0,0,0.2)] p-[36px_32px] text-center"
      >
        <div
          className={`mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center border ${
            isDelete
              ? 'bg-red-500/10 text-red-500 border-red-500/20'
              : isUnsuspend
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}
        >
          {isDelete ? (
            <Trash2 size={28} />
          ) : isUnsuspend ? (
            <ShieldCheck size={28} />
          ) : (
            <ShieldOff size={28} />
          )}
        </div>

        <h3 className="font-poppins font-bold text-[20px] text-text-main mb-2">
          {isDelete
            ? `Delete ${clubName}?`
            : isUnsuspend
            ? `Unsuspend ${clubName}?`
            : `Suspend ${clubName}?`}
        </h3>
        <p className="font-roboto text-[14px] text-text-muted leading-relaxed mb-7">
          {isDelete
            ? 'This action will permanently purge this club, all scheduled rides, and member associations. This cannot be undone.'
            : isUnsuspend
            ? 'This club will be restored to public directory searches and organizers will regain ride scheduling privileges.'
            : 'This club will be hidden from mobile discovery and organizers will be prevented from scheduling new rides.'}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-poppins font-semibold text-[14px] text-white transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 ${
              isDelete
                ? 'bg-red-500 hover:bg-red-600'
                : isUnsuspend
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-accent hover:bg-accent/90'
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Yes, Proceed
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl font-poppins font-semibold text-[14px] text-text-main bg-transparent border border-border hover:bg-surface/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
