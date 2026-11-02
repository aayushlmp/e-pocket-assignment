import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Generic confirm dialog built on the shared shadcn/ui Dialog.
 *
 * - "Yes" → notifies the parent through `onConfirm`, then closes.
 * - "No"  → only closes the dialog.
 *
 * Fully controlled: the parent owns `open`/`onOpenChange`, so it can also
 * veto the close (e.g. keep the box open while an async action is running).
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open (owned by the parent's state). */
  open: boolean;
  /** Reports open-state changes — the parent closes by setting `false`. */
  onClose: (open: boolean) => void;
  /** Callback notified to the parent when "Yes" is clicked. */
  onConfirm?: () => void;
  /** Title of the dialog. @default "Are you sure?" */
  title?: ReactNode;
  /** Description rendered under the title. */
  description?: ReactNode;
  /** Custom header — replaces the default title/description header. */
  header?: ReactNode;
  /** Body content rendered between header and footer. */
  content?: ReactNode;
  /** Custom footer — replaces the default Yes/No buttons. */
  footer?: ReactNode;

  /** Label of the confirm button. @default "Yes" */
  confirmText?: string;
  /** Label of the cancel button. @default "No" */
  cancelText?: string;
  /** Renders the confirm button in the destructive style (deletes, ...). */
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  title = "Are you sure?",
  description,
  header,
  content,
  footer,
  confirmText = "Yes",
  cancelText = "No",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const close = () => onClose(false);

  const handleConfirm = () => {
    // "Yes" → notify the parent component, then close
    onConfirm?.();
    close();
  };

  const renderHeader =
    header !== undefined ? (
      header
    ) : (
      <DialogHeader>
        <DialogTitle className="text-lg">{title}</DialogTitle>
        {description !== undefined ? (
          <DialogDescription className="text-sm py-2">{description}</DialogDescription>
        ) : null}
      </DialogHeader>
    );

  const renderFooter =
    footer !== undefined ? (
      footer
    ) : (
      <DialogFooter>
        {/* "No" just closes the box */}
        <Button type="button" variant="outline" size="lg" className="px-8 py-4 text-md" onClick={close}>
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={destructive ? "destructive" : "default"}
          size="lg"
          className="px-8 py-4 text-md "
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Exactly two actions (Yes/No) — no extra X close button */}
      <DialogContent showCloseButton={false} className="rounded-xl shadow-lg p-6 text-sm">
        {renderHeader}
        {content}
        {renderFooter}
      </DialogContent>
    </Dialog>
  );
}
