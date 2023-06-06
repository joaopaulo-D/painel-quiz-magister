import { Box, Button, Flex, Heading, Divider, VStack, SimpleGrid, HStack, Select, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { firebase } from "../../firebase/firebase";

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useRouter } from "next/router";

type CreateUserFormData = {
  natureza: string;
}

const createUserFormSchema = yup.object().shape({
  natureza: yup.string().required('Natureza é obrigatória'),
})

export default function createNature() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleCreateNature: SubmitHandler<CreateUserFormData> = async (values) => {
    // console.log(values)
    try {
      await firebase.firestore().collection("natures").add({
        natureza: values.natureza,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .finally(() => router.push('/nature'))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="white"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateNature)}
        >
          <Heading size="lg" fontWeight="normal" color="gray.500">Criar natureza</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="natureza"
                label="Natureza"
                {...register('natureza')}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/nature" passHref>
                <Button as="a" colorScheme="red">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                colorScheme="green"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}