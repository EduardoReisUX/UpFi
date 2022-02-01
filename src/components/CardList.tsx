import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState('');

  const handleViewImage = (url: string) => {
    setSelectedImage(url);
    onOpen();
  };

  return (
    <>
      <SimpleGrid
        templateColumns={'repeat(auto-fit, minmax(293.33px, 1fr))'}
        gridGap={10}
        mb={10}
      >
        {cards.map(card => (
          <Card data={card} viewImage={handleViewImage} key={card.id}></Card>
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        imgUrl={selectedImage}
        onClose={onClose}
      />
    </>
  );
}
