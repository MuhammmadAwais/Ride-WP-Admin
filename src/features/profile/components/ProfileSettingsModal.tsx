import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X, Camera, User } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { cn } from '@/lib/utils';

export interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'profile' | 'password';

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ViewState>('profile');
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((s) => s.auth.user);

  // Form states
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Animate in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }
      );
    } else {
      document.body.style.overflow = 'auto';
      // Reset view on close
      setTimeout(() => setView('profile'), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(modalRef.current, {
      scale: 0.95,
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-2xl"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden",
          "bg-white dark:bg-[#282828] text-gray-900 dark:text-gray-100"
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-poppins text-center flex-1 ml-6">
              {view === 'profile' ? 'Profile Settings' : 'Change Password'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile View */}
          {view === 'profile' && (
            <div className="flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300">
              {/* Avatar Section */}
              <div className="flex justify-center">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#EB712B] to-[#C85E22] shadow-lg">
                    <User size={40} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 group-hover:text-[#EB712B] transition-colors">
                    <Camera size={14} />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 font-roboto mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enter Username:
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#EB712B]/50 focus:border-[#EB712B] transition-all"
                    placeholder="User name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enter Email :
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#EB712B]/50 focus:border-[#EB712B] transition-all"
                    placeholder="Email address"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={() => setView('password')}
                    className="text-sm text-[#4A6BFF] hover:text-[#3B5BFF] hover:underline font-medium transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Password View */}
          {view === 'password' && (
            <div className="flex flex-col gap-4 font-roboto animate-in fade-in zoom-in-95 duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#EB712B]/50 focus:border-[#EB712B] transition-all"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#EB712B]/50 focus:border-[#EB712B] transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#EB712B]/50 focus:border-[#EB712B] transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={view === 'password' ? () => setView('profile') : handleClose}
              className="px-8 py-2.5 rounded-full font-medium text-sm text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClose}
              className="px-8 py-2.5 rounded-full font-medium text-sm text-white bg-[#4A6BFF] hover:bg-[#3B5BFF] shadow-md shadow-[#4A6BFF]/30 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default ProfileSettingsModal;
