import { Box, Flex, Button, useDisclosure, Image } from '@chakra-ui/react';

import { ModalAddImage } from './Modal/AddImage';

export function Header(): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bgColor="pGray.800">
        <Flex
          flexDir={['column', 'row']}
          justifyContent="space-between"
          alignItems="center"
          maxW={1120}
          mx="auto"
          px={[4, 20]}
          py={[4, 6]}
        >
          <Image src="logo.svg" h={10} mb={[4, 0]} />
          <Button width={['full', 'auto']} onClick={() => onOpen()}>
            Adicionar imagem
          </Button>
        </Flex>
      </Box>

      <ModalAddImage isOpen={isOpen} onClose={onClose} />
    </>
  );
}
