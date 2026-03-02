import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
type DeleteBannerDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeleteBannerDialog({
  open,
  onConfirm,
  onClose,
}: DeleteBannerDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this banner?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
