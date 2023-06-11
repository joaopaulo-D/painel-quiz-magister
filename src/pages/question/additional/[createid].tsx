import { useEffect, useState } from "react";

import { Box, Button, Flex, Heading, Divider, VStack, SimpleGrid, HStack, Select, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from "../../../components/Form/Input";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { useRouter } from "next/router";

import { firebase } from "../../../firebase/firebase";
import { TextArea } from "../../../components/Form/TextArea";

type CreateAdditionalQuestionFormData = {
  questao: string;
  alternative1: string;
  alternative2: string;
  alternative3: string;
  alternative4: string;
  alternative5: string;
}

const createAdditionalQuestionFormSchema = yup.object().shape({
  questao: yup.string().required('Questão é obrigatória'),
  alternative1: yup.string().required('Alternativa é obrigatória'),
  alternative2: yup.string().required('Alternativa é obrigatória'),
  alternative3: yup.string().required('Alternativa é obrigatória'),
  alternative4: yup.string().required('Alternativa é obrigatória'),
  alternative5: yup.string().required('Alternativa é obrigatória'),
})

export default function createAdditionalQuestion() {

  const [alternativeCorrect, setAlternativeCorrect] = useState<string>("");

  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createAdditionalQuestionFormSchema)
  })

  const { errors } = formState

  const handleCreateAdditionalQuestion: SubmitHandler<CreateAdditionalQuestionFormData> = async (values) => {
    try {
      await firebase.firestore().collection("questions").doc(router.query.createid as string).update({
        questions: firebase.firestore.FieldValue.arrayUnion(...[{
          title: values.questao,
          alternatives: [values.alternative1, values.alternative2, values.alternative3, values.alternative4, values.alternative5],
          correct: alternativeCorrect
        }])
      })
      .finally(() => router.push("/question"))
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
          onSubmit={handleSubmit(handleCreateAdditionalQuestion)}
        >
          <Heading size="lg" fontWeight="normal" color="gray.500">Criar questão</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <TextArea
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
              <Input
                name="alternative5"
                label="Alternativa 5"
                error={errors.alternative5}
                {...register('alternative5')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Text fontWeight="bold" mb={2} color="gray.500">Alternativa Correta</Text>
                <Select bg="white" placeholder='Selecione a alternativa correta' color="gray.500" size={"lg"} borderColor="blue.200" borderWidth={2} onChange={(values) => setAlternativeCorrect(values.target.value)}>
                  <option style={{ color: "gray" }} value='1'>Alternativa 1</option>
                  <option style={{ color: "gray" }} value='2'>Alternativa 2</option>
                  <option style={{ color: "gray" }} value='3'>Alternativa 3</option>
                  <option style={{ color: "gray" }} value='4'>Alternativa 4</option>
                  <option style={{ color: "gray" }} value='4'>Alternativa 5</option>
                </Select>
              </Box>
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-start">
            <HStack spacing="4">
              <Button
                type="submit"
                colorScheme="green"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
              <Link href="/question" passHref>
                <Button as="a" colorScheme="red">Cancelar</Button>
              </Link>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}