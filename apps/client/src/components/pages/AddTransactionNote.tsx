import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { addTransactionNote } from "@/services/transaction.service";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface AddTransactionNoteDialogProps {
  /** Whether the dialog is open (owned by the parent's state). */
  open: boolean;
  /** Reports open-state changes — the parent closes by setting `false`. */
  onClose: (open: boolean) => void;
  /** Transaction to attach the note to. */
  transactionId: string | null;
  /** Optional callback fired after a note is successfully added. */
  onNoteAdded?: () => void;
}

export function AddTransactionNote({
  open,
  onClose,
  transactionId
}: AddTransactionNoteDialogProps) {
  const close = () => onClose(false);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = note.trim().length === 0;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNote(event.target.value);
      setError(null);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.SubmitEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      if (isEmpty) {
        setError("This is required");
        return;
      }
      setError(null);

      try {
        const response = await addTransactionNote(
          transactionId!,
          note.trim(),
        );
        toast.success(
          response.data.message || "Note added successfully",
        );
        close();
      } catch (err: any) {
        const message = err?.message || "Failed to add note";
        setError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [transactionId, close],
  );

  return (
    <Dialog open={open} onOpenChange={close}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogContent
          className="rounded-xl shadow-lg p-6 sm:max-w-md"
          showCloseButton={true}
        >
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to transaction
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field data-invalid={isSubmitting && (!!error || isEmpty)}>
              <Label htmlFor="comment">Note</Label>
              <FieldContent>
                <textarea
                  id="comment"
                  name="comment"
                  value={note}
                  rows={5}
                  className="outline p-2"
                  placeholder="Type your note here..."
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </FieldContent>
              {isSubmitting && error && <FieldError errors={[{ message: error }]} />}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
