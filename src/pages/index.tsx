import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const fetchImages = ({ pageParam = 1 }) =>
  api.get(`/images?after=${pageParam}`);

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchImages,
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      staleTime: 1000,
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (data === undefined) return;

    const newData: [] = data.pages[0].data.data.map(dataFromFauna => ({
      title: dataFromFauna.title,
      description: dataFromFauna.description,
      url: dataFromFauna.url,
      ts: dataFromFauna.ts,
      id: dataFromFauna.id,
    }));

    // sort newData from newest to oldest upload
    newData.sort((a, b) => b.ts - a.ts);

    return newData;
  }, [data]);

  return (
    <>
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        {
          // TODO RENDER LOADING SCREEN
          // TODO RENDER ERROR SCREEN
          isLoading ? (
            <Loading />
          ) : isError ? (
            <Error />
          ) : (
            <CardList cards={formattedData} />
          )
        }

        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
