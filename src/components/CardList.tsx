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
  cards?: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const disclosure = useDisclosure();

  // TODO SELECTED IMAGE URL STATE
  const [selectedImage, setSelectedImage] = useState();

  // TODO FUNCTION HANDLE VIEW IMAGE
  const handleViewImage = () => {};

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid>
        {cards?.map((card, index) => (
          <Card
            data={{ ...card }}
            viewImage={handleViewImage}
            key={index}
          ></Card>
        ))}
        {!cards && 'Nenhum card disponível'}
      </SimpleGrid>
      {/* TODO MODALVIEWIMAGE */}
    </>
  );
}
