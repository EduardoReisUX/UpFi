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
    .required('Título obrigatório')
    .min(2, 'Mínimo de 2 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
  description: yup
    .string()
    .required('Descrição obrigatória')
    .max(65, 'Máximo de 65 caracteres'),
  image: yup
    .mixed()
    .required('Arquivo obrigatório')
    .test('size', 'O arquivo deve ser menor que 10MB', value => {
      if (!value.length) return false;

      return value[0].size <= 10_000_000;
    })
    .test('type', 'Somente são aceitos arquivos PNG, JPEG e GIF', value => {
      if (!value.length) return false;

      const reg = /image\/(jpeg|png|gif)/g;
      const result = reg.test(value[0].type);
      return result;
    }),
});

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (addImageForm: AddImageFormData) => {
      const response = await api.post('/images', {
        title: addImageForm.title,
        description: addImageForm.description,
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
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          isClosable: true,
        });
      }

      // TODO EXECUTE ASYNC MUTATION
      //@ts-ignore
      await mutation.mutateAsync(data);

      // TODO SHOW SUCCESS TOAST
      toast({
        title: 'Upload concluído.',
        description: 'Fizemos o upload da imagem para você.',
        status: 'success',
        isClosable: true,
      });
    } catch (err) {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
      setImageUrl('');
      setLocalImageUrl('');
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
          error={errors.image}
          {...register('image')}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          error={errors.title}
          {...register('title')}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          error={errors.description}
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
