import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={'pGray.800'}>
        <ModalBody p={0}>
          <Image src={imgUrl} alt={`Imagem ${imgUrl}`} w={'100%'} h={'100%'} />
        </ModalBody>
        <ModalFooter m={2} p={0} h={'2rem'}>
          <Link href={imgUrl} isExternal fontSize={'1rem'} mr={'auto'}>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
