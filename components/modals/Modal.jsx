import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function MyModal({
  title,
  children,
  Footer,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {title && (
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
              )}
              <ModalBody>{children}</ModalBody>
              {Footer && (
                <ModalFooter>{<Footer onClose={onClose} />}</ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
