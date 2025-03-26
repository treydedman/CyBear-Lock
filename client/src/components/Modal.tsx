import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold">
          Are you sure you want to delete this entry?
        </h3>
        <p className="text-sm mt-2">This action cannot be undone.</p>

        <div className="flex justify-between items-center mt-4 space-x-2">
          <button
            onClick={onClose}
            className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-lg focus:outline-none">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-950 text-white hover:bg-teal-500 px-4 py-2 rounded-lg focus:outline-none">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
