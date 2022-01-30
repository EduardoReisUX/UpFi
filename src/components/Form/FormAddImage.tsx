import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type AddImageFormData = {
  title: string;
  description: string;
  image: FileList;
};

interface FormAddImageProps {
  closeModal: () => void;
}

// Yup validation
const newImageFormSchema = yup.object().shape({
  title: yup
    .string()
    .required('Título da imagem obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres'),
  description: yup
    .string()
    .required('Descrição obrigatória')
    .max(60, 'Máximo 60 caracteres'),
  image: yup
    .mixed()
    .test(
      'fileSize',
      'O arquivo tem que ser JPEG e menor que 10 MB.',
      value => {
        console.log(value);
        if (!value.length) return false;

        // return true if it's less than 10 MB and its JPEG
        return value[0].size <= 10_000_000 && value[0].type === 'image/jpeg';
      }
    ),
});

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (addImage: AddImageFormData) => {
      const response = await api.post('/images', {
        title: addImage.title,
        description: addImage.description,
        url: imageUrl,
      });

      console.log({
        title: addImage.title,
        description: addImage.description,
        url: imageUrl,
      });

      return response.data.newImage;
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm({ resolver: yupResolver(newImageFormSchema) });
  const { errors } = formState;

  const onSubmit: SubmitHandler<AddImageFormData> = async (
    data: Record<string, unknown>
  ): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST

      //@ts-ignore
      await mutation.mutateAsync(data);

      toast({
        title: 'Upload concluído.',
        description: 'Fizemos o upload da imagem para você.',
        status: 'success',
        isClosable: true,
        duration: 4500,
      });
    } catch (err) {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED

      toast({
        title: 'Erro.',
        description: err.message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          onChange={event =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            })
          }
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          error={formState.errors.image}
          {...register('image')}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          error={formState.errors.title}
          {...register('title')}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          error={formState.errors.description}
          {...register('description')}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
