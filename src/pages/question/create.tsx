import { useEffect, useState } from "react";

import { Box, Button, Flex, Heading, Divider, VStack, SimpleGrid, HStack, Select, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useRouter } from "next/router";

import { firebase } from "../../firebase/firebase";

import { Discipline } from "../../dtos/Discipline";
import { Nature } from "../../dtos/Nature";

type CreateQuestionFormData = {
  questao: string;
  alternative1: string;
  alternative2: string;
  alternative3: string;
  alternative4: string;
}

const createQuestionFormSchema = yup.object().shape({
  questao: yup.string().required('Questão é obrigatória'),
  alternative1: yup.string().required('Alternativa é obrigatória'),
  alternative2: yup.string().required('Alternativa é obrigatória'),
  alternative3: yup.string().required('Alternativa é obrigatória'),
  alternative4: yup.string().required('Alternativa é obrigatória'),
})

export default function createQuestion() {

  const [alternativeCorrect, setAlternativeCorrect] = useState<string>("");
  const [discipline, setDiscipline] = useState<Discipline[]>([]);
  const [nature, setNature] = useState<Nature[]>([]);
  const [selectNature, setSelectNature] = useState<string>("");
  const [selectDiscipline, setSelectDiscipline] = useState<string>("");

  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createQuestionFormSchema)
  })

  const { errors } = formState

  const handleCreateQuestion: SubmitHandler<CreateQuestionFormData> = async (values) => {
    try {
      await firebase.firestore().collection("questions").doc().set({
        title: selectDiscipline,
        natureza: selectNature,
        questions: [
          {
            title: values.questao,
            alternatives: [values.alternative1, values.alternative2, values.alternative3, values.alternative4],
            correct: alternativeCorrect
          }
        ],
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .finally(() => router.push("/question"))
    } catch (error) {
      console.log(error.message)
    }
  }

  async function getAllNature() {
    try {
      await firebase.firestore().collection("natures").onSnapshot((query) => {
        const nat = query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            checked: false
          }
        }) as unknown as Nature[]

        setNature(nat)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  async function getAllDiscipline() {
    try {
      await firebase.firestore().collection("disciplines").where("natureza", "==", selectNature).onSnapshot((query) => {
        const nat = query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            checked: false
          }
        }) as unknown as Discipline[]

        setDiscipline(nat)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getAllNature()
    getAllDiscipline()
  }, [selectNature])

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
          onSubmit={handleSubmit(handleCreateQuestion)}
        >
          <Heading size="lg" fontWeight="normal" color="gray.500">Criar questão</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Text fontWeight="bold" mb={2} color="gray.500">Natureza</Text>
                <Select bg="white" placeholder='Selecione uma natureza' color="gray.500" borderColor="blue.200" borderWidth={1} size={"lg"}  onChange={(values) => setSelectNature(values.target.value)}>
                  {nature.map((nat, index) => (
                    <option key={nat.id} style={{ color: "gray" }} value={nat.natureza}>{`${nat.natureza}`}</option>
                  ))}
                </Select>
              </Box>
              {selectNature ? (
                <Box>
                  <Text fontWeight="bold" mb={2} color="gray.500">Disciplina</Text>
                  <Select bg="white" placeholder='Selecione uma disciplina' size={"lg"} color="gray.500" borderColor="blue.200" borderWidth={1} onChange={(values) => setSelectDiscipline(values.target.value)}>
                    {discipline.map((disc, index) => (
                      <option key={disc.id} style={{ color: "gray" }} value={disc.title}>{`${disc.title}`}</option>
                    ))}
                  </Select>
                </Box>
              ) : null}
            </SimpleGrid>

            <Divider my="2" borderColor="gray.700" />

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="questao"
                label="Questão"
                error={errors.questao}
                {...register('questao')}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="alternative1"
                label="Alternativa 1"
                error={errors.alternative1}
                {...register('alternative1')}
              />

              <Input
                name="alternative2"
                label="Alternativa 2"
                error={errors.alternative2}
                {...register('alternative2')}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="alternative3"
                label="Alternativa 3"
                error={errors.alternative3}
                {...register('alternative3')}
              />
              <Input
                name="alternative4"
                label="Alternativa 4"
                error={errors.alternative}
                {...register('alternative4')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Text fontWeight="bold" mb={2} color="gray.500">Alternativa Correta</Text>
                <Select bg="white" placeholder='Selecione a alternativa correta' color="gray.500" borderColor="blue.200" borderWidth={1} size={"lg"} onChange={(values) => setAlternativeCorrect(values.target.value)}>
                  <option style={{ color: "gray" }} value='1'>Alternativa 1</option>
                  <option style={{ color: "gray" }} value='2'>Alternativa 2</option>
                  <option style={{ color: "gray" }} value='3'>Alternativa 3</option>
                  <option style={{ color: "gray" }} value='4'>Alternativa 4</option>
                </Select>
              </Box>
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/question" passHref>
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