import { useState } from 'react';

function useModal<T = unknown>(initData?: T) {
  const [data, setData] = useState<T | undefined>(initData);
  const [isOpen, setIsOpen] = useState(false);

  function openModal(data?: T) {
    if (data) {
      setData(data);
    }

    setIsOpen(true);
  }

  function closeModal() {
    setData(undefined);
    setIsOpen(false);
  }

  function toggleModal() {
    if (isOpen) {
      setData(undefined);
    }

    setIsOpen(!isOpen);
  }

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
}

export default useModal;
