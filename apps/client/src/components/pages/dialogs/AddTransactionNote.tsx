import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldGroup } from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea"
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
}

export function AddTransactionNote({
  open,
  onClose,
  transactionId
}: AddTransactionNoteDialogProps) {
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setError(null);
    setNote("");
  };
  const close = () => {
    reset();
    onClose(false)
  };
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNote(event.target.value);
      setError(null);
    },
    [],
  );

  const handleSubmit = useCallback(
  async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transactionId) {
      console.error(`Transaction ID is required`)
      return;
    }
    setIsSubmitting(true);
    const isEmpty = note.trim().length === 0;
    if(isEmpty) {
      setError("Note is required");
      return;
    };
    
    try {
      const response = await addTransactionNote(
        transactionId,
        note.trim(),
      );

      toast.success(
        response.data.message || "Note added successfully",
      );
      reset();
      close();
    } catch (err: any) {
      setError(null);
      const message = err?.message || "Failed to add note";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setError(null);
    }
  },
  [transactionId, note],
);

  return (
    <Dialog open={open} onOpenChange={close}>
        <DialogContent
          className="rounded-xl shadow-lg p-6 sm:max-w-md"
          showCloseButton={true}
        >
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
              <DialogDescription>
                Add a note to transaction
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field data-invalid={isSubmitting && (!!error)}>
                {/* <Label htmlFor="comment">Note</Label> */}
                <FieldContent>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={note}
                    rows={8}
                    className="outline p-2"
                    placeholder="Type your note here..."
                    onChange={handleChange}
                    aria-invalid={isSubmitting && (!!error)}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2"
              >Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
}
