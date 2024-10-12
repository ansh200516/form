// components/ui/Modal.js
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Button from './Button';
import classNames from 'classnames';

const Modal = ({ trigger, title, description, children, onConfirm, onClose }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className={classNames(
            'fixed top-1/2 left-1/2 max-w-lg w-full bg-white rounded-lg p-6 shadow-lg transform -translate-x-1/2 -translate-y-1/2',
            {
              'animate-enter': true,
              'animate-exit': true,
            }
          )}
        >
          <Dialog.Title className="text-xl font-semibold mb-2">{title}</Dialog.Title>
          <Dialog.Description className="mb-4">{description}</Dialog.Description>
          <div className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;