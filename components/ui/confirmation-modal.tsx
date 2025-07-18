"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'destructive' | 'default';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'default'
}: ConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#1A1A1A] border-[#333333]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E9E7E2] flex items-center gap-2">
            {variant === 'destructive' && (
              <Trash2 className="h-5 w-5 text-red-500" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#E9E7E2]/70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading}
            className="border-[#333333] text-[#E9E7E2]/70 hover:bg-[#252525]"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              ${variant === 'destructive' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-[#FF5001] hover:bg-[#FF5001]/90 text-[#161616]'
              }
              disabled:opacity-50
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationModal;