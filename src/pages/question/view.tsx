import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link, Badge, HStack, VStack } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";
import { convertTimeStampToString } from "../../utils/date";

import { Question } from "../../dtos/Question";

export default function ViewQuestions() {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, serError] = useState("")

  const [questions, setQuestions] = useState<Question[]>([])

  function getAllQuestions() {
    try {
      setIsLoading(true)
      firebase.firestore().collection("questions").doc(router.query.id as string).onSnapshot((query) => {
        if (query.exists) {
          const data = query.data() as Question[]
          console.log(data)
          setQuestions([data])
        }

        setIsLoading(false)
      })
    } catch (error) {
      console.log(error)
      serError(error)
    }
  }

  async function deleteQuestion(index: number) {
    try {
      const questionCollection = firebase.firestore().collection("questions").doc(router.query.id as string)
      await questionCollection.update({
        questions: firebase.firestore.FieldValue.arrayRemove(
          await questionCollection.get().then((doc) => doc.data().questions[index])
        )
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  function updateCheckStatus(index: number) {
    setQuestions(questions.map((q, currentIndex) => currentIndex === index ? { ...q, checked: !q.checked } : q))
  }

  useEffect(() => {
    getAllQuestions()
  }, [])

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="white" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal" color="gray.500">
              Questões de {router.query.title}
            </Heading>

            <Badge borderColor="blue.200" borderWidth={1} colorScheme={router.query.natureza == "Exatas" ? "red" : router.query.natureza == "Humanas" ? "green" : "gray"}>
              Natureza: {router.query.natureza}
            </Badge>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner color="blue.200"/>
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text color="gray.500">Falha em obter dados das questões</Text>
            </Flex>
          ) : (
            <>
              <Table variant="striped" colorScheme="whiteAlpha">
                <Thead bg="blue.200">
                  <Tr>
                    <Th></Th>
                    <Th color="white">Questão</Th>
                    <Th color="white">Total de Alternativas</Th>
                    {isWideVersion && <Th color="white">Alternativa Correta</Th>}
                    <Th width="8" color="white">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody bg="white.300">

                  {questions.map((q, index) => {
                    return (
                      <React.Fragment key={q.id}>
                        {q.questions.map((question, index_question) => (
                          <Tr>
                            <Td color="gray.500">{index_question+1}</Td>
                            <Td color="gray.500">{question.title}</Td>
                            <Td>
                              {/* {question.alternatives.map((alternative, index) => (
                                <Text key={index}>{alternative}</Text>
                              ))} */}
                              <Text color="gray.500">{question.alternatives.length}</Text>
                            </Td>
                            <Td color="gray.500">{question.correct}</Td>
                            <Td>
                              <HStack>
                                <Box>
                                  <Button
                                    as="a"
                                    size="sm"
                                    fontSize="sm"
                                    colorScheme="green"
                                    cursor="pointer"
                                  >
                                    <Icon as={RiPencilLine} fontSize="16" />
                                  </Button>
                                </Box>
                                <Box>
                                  <Button
                                    as="a"
                                    size="sm"
                                    fontSize="sm"
                                    colorScheme="red"
                                    cursor="pointer"
                                    onClick={() => deleteQuestion(index_question)}
                                  >
                                    <Icon as={RiDeleteBinLine} fontSize="16" />
                                  </Button>
                                </Box>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </React.Fragment>
                    )
                  })}

                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={questions.length}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
          <Flex mt="10" justify="flex-end">
            <HStack spacing="4">
              <Button as="a" cursor="pointer" onClick={() => router.back()} colorScheme="red">Voltar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}