import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Box, Button, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link, Badge, HStack, VStack, Stack, useDisclosure } from "@chakra-ui/react";
import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";

import { Alternative, Question } from "../../dtos/Question";
import { ModalViewQuestion } from "../../components/ModalViewQuestion";

export default function ViewQuestions() {
  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, serError] = useState("")

  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalViewQuestion, setModalViewQuestion] = useState<Alternative>();

  const [itemPages, setItemPages] = useState(2)
  const [currentPage, setCurrentPage] = useState(0);

  const pages = Math.ceil(questions.length / itemPages);
  const startIdex = currentPage * itemPages;
  const endIdex = startIdex + itemPages;
  const currentItens = questions.slice(startIdex, endIdex);

  function getAllQuestions() {
    try {
      setIsLoading(true)
      firebase.firestore().collection("questions").doc(router.query.id as string).onSnapshot((query) => {
        if (query.exists) {
          const data = query.data() as Question[]
          // console.log(data)
          setQuestions([data] as any)
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

  function handleModalViewQuestion(question: Alternative){
    console.log(isOpen)
    setModalViewQuestion(question)
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
              <Spinner color="blue.200" />
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

                  {currentItens.map((q, index) => {
                    return (
                      <>
                        {q.questions.map((question, index_question) => (
                          <Tr borderBottomColor="gray.400" borderBottomWidth={2} w="full">
                            <Td color="gray.500">{index_question + 1}</Td>
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
                                    colorScheme="blue"
                                    cursor="pointer"
                                    onClick={() => {
                                      handleModalViewQuestion(question) 
                                      onOpen()
                                    }}
                                  >
                                    <Icon as={TbListDetails} fontSize="16" />
                                  </Button>
                                </Box>
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
                      </>
                    )
                  })}

                </Tbody>
              </Table>

              <Stack
                spacing="6"
                direction={["column", "row"]}
                mt="8"
                justify="space-between"
                align="center"
              >
                <HStack>
                  <Text color="gray.500">0 - </Text><Text color="gray.500">10 de</Text><Text color="gray.500">100</Text>
                </HStack>

                <Stack direction="row" spacing="2">

                  {Array.from(Array(pages), (item, index) => {
                    return (
                      <Button
                        size="sm"
                        value={index}
                        fontSize="xs"
                        width="4"
                        bgColor="blue.200"
                        onClick={(e) => setCurrentPage(Number(e.currentTarget.value))}
                      >
                        <Text color="white">{index + 1}</Text>
                      </Button>
                    )
                  })}

                </Stack>
              </Stack>
            </>
          )}
          {isOpen ? <ModalViewQuestion question={modalViewQuestion} isOpen={isOpen} onClose={onClose}/> : null}
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