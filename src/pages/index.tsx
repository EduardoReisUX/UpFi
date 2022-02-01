import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const fetchImages = ({ pageParam = null }) =>
  !!pageParam ? api.get(`/images?after=${pageParam}`) : api.get('/images');

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
      getNextPageParam: lastPage => lastPage.data?.after,
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (!data) return;

    const dataFromPages = data.pages.map(page => {
      return page.data.data.map(image => ({
        title: image.title,
        description: image.description,
        url: image.url,
        ts: image.ts,
        id: image.id,
      }));
    });

    const dataFromAllPages = dataFromPages.reduce((prevPage, currentPage) => [
      ...prevPage,
      ...currentPage,
    ]);

    const index: number = data.pages.length - 1;
    const after: number = data.pages[index]?.data.after || null;

    return {
      after,
      dataFromAllPages,
    };
  }, [data]);

  return isLoading ? (
    <Loading />
  ) : isError ? (
    <Error />
  ) : (
    <>
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData.dataFromAllPages} />

        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage({ pageParam: formattedData.after })}
        >
          {isFetchingNextPage
            ? 'Carregando...'
            : hasNextPage
            ? 'Carregar mais'
            : 'Nada mais para carregar'}
        </Button>
      </Box>
    </>
  );
}
