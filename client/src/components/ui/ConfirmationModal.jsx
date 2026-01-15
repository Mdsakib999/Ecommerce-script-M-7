import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </div>
        
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="flex gap-3 w-full justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
