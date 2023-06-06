import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link, Badge, HStack } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";

import { Discipline } from "../../dtos/Discipline";
import { convertTimeStampToString } from "../../utils/date";

export default function DisciplineList() {
  const [page, setPage] = useState(1);

  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState("")

  const [discipline, setDiscipline] = useState<Discipline[]>([])

  async function getAllDiscipline(){
    try {
      setIsLoading(true)
      await firebase.firestore().collection("disciplines").onSnapshot((query) => {
        const discipline = query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            checked: false
          }
        }) as unknown as Discipline[]

        setDiscipline(discipline)
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error.message)
      setError(error.message)
    }
  }

  async function deleteDiscipline(id: string){
    try {
      await firebase.firestore().collection("disciplines").doc(id).delete().finally(() => console.log("foi deletado"))
    } catch (error) {
      console.log(error.message)
    }
  }

  function handleUpdatePageDiscipline(id: string, natureza: string, discipline: string){
    router.push({
      pathname: "discipline/update",
      query: {
        id: id,
        natureza: natureza,
        discipline: discipline
      }
    }, "discipline/update")
  }

  function updateCheckStatus(index: number) {
    setDiscipline(discipline.map((dis, currentIndex) => currentIndex === index ? { ...dis, checked: !dis.checked } : dis))
  }

  useEffect(() => {
    getAllDiscipline()
  }, [])

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="white" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading color="gray.500" size="lg" fontWeight="normal">
              Disciplinas

              { isLoading && <Spinner size="sm" color="blue.200" ml="4"/> }
            </Heading>

            <NextLink href="/discipline/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar Disciplinas
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner color="blue.200"/>
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text color="gray.500">Falha em obter dados das disciplinas</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead bg="blue.500">
                  <Tr>
                    <Th px={["4", "4", "8"]} color="white" width="8">
                      <Checkbox colorScheme="white" />
                    </Th>
                    <Th color="white">Disciplinas</Th>
                    <Th color="white">Natureza</Th>
                    {isWideVersion && <Th color="white">Data de cadastro</Th>}
                    <Th color="white" width="8">Ações</Th>
                  </Tr>
                </Thead>

                <Tbody bg="white.300">

                  {discipline.map((disc, index) => {
                    return (
                      <Tr borderBottomColor="gray.200" borderBottomWidth={2} w="full" key={disc.id}>
                        <Td px={["4", "4", "8"]}>
                          <Checkbox
                            colorScheme="blue"
                            key={disc.id}
                            checked={disc.checked}
                            onChange={() => updateCheckStatus(index)}
                          />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="white" onMouseEnter={() => console.log("")}>
                              <Text color="gray.500" fontWeight="bold">{disc.title}</Text>
                            </Link>
                          </Box>
                        </Td>
                        <Td>
                          <Badge colorScheme={disc.natureza == "Exatas" ? "red" : disc.natureza == "Humanas" ? "green" : "gray"}>{disc.natureza}</Badge>
                        </Td>
                        {isWideVersion && <Td color="gray.500" fontWeight="bold">{convertTimeStampToString(disc.created_at)}</Td>}
                        <Td>
                          <HStack>
                            <Box>
                              <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="blue"
                                cursor="pointer"
                                leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                                onClick={() => handleUpdatePageDiscipline(disc.id, disc.natureza, disc.title)}
                              >
                                {isWideVersion ? 'Editar disciplina' : ''}
                              </Button>
                            </Box>
                            {disc.checked ? (
                              <Box>
                                <Button
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  colorScheme="red"
                                  cursor="pointer"
                                  leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                                  onClick={() => deleteDiscipline(disc.id)}
                                >
                                  {isWideVersion ? 'Excluir disciplina' : ''}
                                </Button>
                              </Box>
                            ) : null}
                          </HStack>
                        </Td>
                      </Tr>
                    )
                  })}

                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={10}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}

        </Box>
      </Flex>
    </Box>
  )
}