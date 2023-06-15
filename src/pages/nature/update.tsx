import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Flex, Heading, Divider, VStack, SimpleGrid, HStack, Select, Text, Spinner } from "@chakra-ui/react";

import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";
import { Nature } from "../../dtos/Nature";

type UpdateNatureFormData = {
  natureza: string;
}

const updateNatureFormSchema = yup.object().shape({
  natureza: yup.string().required('Natureza é obrigatória'),
})

export default function updateNature() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(updateNatureFormSchema)
  })

  const handleUpdateNature: SubmitHandler<UpdateNatureFormData> = async (values) => {
    try {
      await firebase.firestore().collection("natures").doc(router.query.id as string).update({
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
          onSubmit={handleSubmit(handleUpdateNature)}
        >
          <Heading size="lg" color="gray.500" fontWeight="normal">Editar natureza</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="natureza"
                label="Natureza"
                defaultValue={router.query.natureza as string}
                {...register('natureza')}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-start">
            <HStack spacing="4">
              <Button
                type="submit"
                colorScheme="green"
                isLoading={formState.isSubmitting}
              >
                Atualizar
              </Button>
              <Link href="/discipline" passHref>
                <Button as="a" colorScheme="red">Cancelar</Button>
              </Link>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}