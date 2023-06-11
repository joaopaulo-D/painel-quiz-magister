import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Spinner,
  Text,
  Select,
  HStack,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Tbody,
  useBreakpointValue,
  Td,
  Badge,
  Link,
  Stack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";

import { Nature } from "../../dtos/Nature";

import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { Question } from "../../dtos/Question";

import { useRouter } from "next/router";
import { PaginationItem } from "../../components/Pagination/PaginationItem";

interface ViewQuestionProps {
  id: string;
  natureza: string;
  title: string;
  create_at: string;
  questions: any;
}

export default function QuestionList() {

  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [natureAll, setNatureAll] = useState<Nature[]>([]);
  const [selectNature, setSelectNature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [itemPages, setItemPages] = useState(4)
  const [currentPage, setCurrentPage] = useState(0);

  const pages = Math.ceil(questions.length / itemPages);
  const startIdex = currentPage * itemPages;
  const endIdex = startIdex + itemPages;
  const currentItens = questions.slice(startIdex, endIdex);

  async function getAllQuestion() {
    try {
      if (selectNature) {
        await firebase.firestore().collection("questions").where("natureza", "==", selectNature).onSnapshot((query) => {
          const data = query.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data()
            }
          }) as Question[]
          setQuestions(data)
        })
      } else {
        await firebase.firestore().collection("questions").onSnapshot((query) => {
          const data = query.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data()
            }
          }) as Question[]
          setQuestions(data)
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async function getAllNature() {
    try {
      setIsLoading(true)
      await firebase.firestore().collection("natures").onSnapshot((query) => {
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

  async function deleteQuestion(id: string) {
    try {
      await firebase.firestore().collection("questions").doc(id).delete().finally(() => setSelectNature(""))
    } catch (error) {
      console.log(error.message)
    }
  }

  function handleAdditionalQuestion(id: string) {
    router.push({
      pathname: "question/additional/[createid]",
      query: { createid: id }
    }, 'question/additional')
  }

  function handleViewQuestion(id: string, title: string, natureza: string) {
    router.push({
      pathname: "question/view",
      query: {
        id: id,
        title: title,
        natureza: natureza
      }
    }, "question/view")
  }

  function updateCheckStatus(index: number) {
    setQuestions(questions.map((question, currentIndex) => currentIndex === index ? { ...question, checked: !question.checked } : question))
  }

  useEffect(() => {
    getAllQuestion()
    getAllNature()
  }, [selectNature])

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="white" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading color="gray.500" size="lg" fontWeight="normal">
              Questões

              {isLoading && <Spinner size="sm" color="gray.500" ml="4" />}
            </Heading>

            <HStack>
              <NextLink href="/question/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Criar Questão inicial
                </Button>
              </NextLink>
              <Box bg="white" >
                <Select bg="white" color="gray.500" borderColor="blue.200" borderWidth={1} rounded={2} placeholder='TODAS AS QUESTÕES' size={"sm"} onChange={(value) => setSelectNature(value.target.value)}>
                  {natureAll.map((nature, index) => (
                    <option key={nature.id} style={{ color: "gray" }} value={nature.natureza}>{nature.natureza.toLocaleUpperCase()}</option>
                  ))}
                </Select>
              </Box>
            </HStack>

          </Flex>

          {/* <Flex mb={10}>
            <Alert status='info' bg="gray.100">
              <AlertIcon />
              <Text color="gray.500">Você so utilizara o botão de cadastro de questão inicial somente quando </Text>
            </Alert>
          </Flex> */}

          {isLoading ? (
            <Flex justify="center">
              <Spinner color="blue.200" />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text color="gray.500">Falha em obter dados dos usuários</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead bg="blue.500">
                  <Tr>
                    <Th px={["4", "4", "8"]} color="white" width="8">
                      <Checkbox colorScheme="white" />
                    </Th>
                    <Th color="white">Disciplina</Th>
                    <Th color="white">Natureza</Th>
                    {/* <Th>Questão</Th> */}
                    {isWideVersion && <Th color="white">Questões cadastrada</Th>}
                    <Th width="8" color="white">Ações</Th>
                  </Tr>
                </Thead>

                <Tbody bg="white.300">

                  {currentItens.map((q, index) => {
                    return (
                      <Tr key={q.id} borderBottomColor="gray.400" borderBottomWidth={2} w="full">
                        <Td px={["4", "4", "8"]}>
                          <Checkbox
                            colorScheme="blue"
                            key={q.id}
                            checked={q.checked}
                            onChange={() => updateCheckStatus(index)}
                          />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="white" onMouseEnter={() => console.log("")}>
                              <Text color="gray.500" fontWeight="bold">{q.title}</Text>
                            </Link>
                          </Box>
                        </Td>
                        <Td>
                          <Badge colorScheme={q.natureza == "Exatas" ? "red" : q.natureza == "Humanas" ? "green" : "gray"}>{q.natureza}</Badge>
                        </Td>
                        {/* <Td>
                          <Text noOfLines={5}>{q.questions[0].title}</Text>
                        </Td> */}
                        {isWideVersion && <Td color="gray.500" fontWeight="bold">{`${q.questions.length}`}</Td>}
                        <Td>
                          <HStack>
                            <Box>
                              <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="blue"
                                cursor="pointer"
                                leftIcon={<Icon as={TbListDetails} fontSize="16" />}
                                onClick={() => handleViewQuestion(q.id, q.title, q.natureza)}
                              >
                                {isWideVersion ? 'Visualizar Questões' : ''}
                              </Button>
                            </Box>
                            <Box>
                              <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="orange"
                                cursor="pointer"
                                leftIcon={<Icon as={RiAddLine} fontSize="16" />}
                                onClick={() => handleAdditionalQuestion(q.id)}
                              >
                                {isWideVersion ? 'Cadastrar Questões' : ''}
                              </Button>
                            </Box>
                            {q.checked ? (
                              <>
                                <Box>
                                  <Button
                                    as="a"
                                    size="sm"
                                    fontSize="sm"
                                    colorScheme="red"
                                    cursor="pointer"
                                    leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                                    onClick={() => deleteQuestion(q.id)}
                                  >
                                    {isWideVersion ? 'Excluir' : ''}
                                  </Button>
                                </Box>
                              </>
                            ) : null}
                          </HStack>
                        </Td>
                      </Tr>
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
        </Box>
      </Flex>
    </Box>
  )
}