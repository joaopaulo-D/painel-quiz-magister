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

type CreateDisciplineFormData = {
  disciplina: string;
}

const createDisciplineFormSchema = yup.object().shape({
  disciplina: yup.string().required('Disciplina é obrigatória'),
})

export default function createDiscipline() {
  const router = useRouter();

  const [natureAll, setNatureAll] = useState<Nature[]>([]);
  const [natureza, setNatureza] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createDisciplineFormSchema)
  })

  const handleCreateDiscipline: SubmitHandler<CreateDisciplineFormData> = async (values) => {
    try {
      await firebase.firestore().collection("disciplines").add({
        title: values.disciplina,
        natureza: natureza,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .finally(() => router.push('/discipline'))
    } catch (error) {
      console.log(error.message)
    }
  }

  function getAllNature() {
    try {
      setIsLoading(true)
      firebase.firestore().collection("natures").onSnapshot((query) => {
        const nature = query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            checked: false
          }
        }) as Nature[]

        setNatureAll(nature)
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getAllNature()
  }, [])

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
          onSubmit={handleSubmit(handleCreateDiscipline)}
        >
          <Heading size="lg" fontWeight="normal" color="gray.500">Criar disciplina</Heading>

          <Divider my="6" borderColor="gray.700" />

          {isLoading ? (
            <Spinner color="gray.100" />
          ) : (
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="disciplina"
                  label="Disciplina"
                  {...register('disciplina')}
                />
                <Box>
                  <Text fontWeight="bold" mb={2} color="gray.300">Natureza</Text>
                  <Select bg="white" borderColor="white.300" borderWidth={2} color="gray.500" placeholder='Selecione uma natureza' size={"lg"} onChange={(value) => setNatureza(value.target.value)}>
                    {natureAll.map((nature, index) => (
                      <option key={nature.id} style={{ color: "gray" }} value={nature.natureza}>{nature.natureza.toLocaleUpperCase()}</option>
                    ))}
                  </Select>
                </Box>
              </SimpleGrid>
            </VStack>
          )}

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/discipline" passHref>
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