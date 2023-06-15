import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link, Badge, HStack } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";
import { convertTimeStampToString } from "../../utils/date";

import { Nature } from "../../dtos/Nature";

export default function NatureList() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, serError] = useState("")

  const [nature, setNature] = useState<Nature[]>([])

  function getAllNatures(){
    try {
      setIsLoading(true)
      firebase.firestore().collection("natures").onSnapshot((query) => {
        const data = query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            checked: false
          };
        }) as Nature[];

        console.log(data)

        setNature(data)
        setIsLoading(false);
      })
    } catch (error) {
      console.log(error)
      serError(error)
    }
  }

  async function deleteNature(id: string){
    try {
      await firebase.firestore().collection("natures").doc(id).delete().finally(() => console.log("foi deletado"))
    } catch (error) {
      console.log(error.message)
    }
  }

  function handleUpdatePageNature(id: string, natureza: string){
    router.push({
      pathname: "nature/update",
      query: {
        id: id,
        natureza: natureza
      }
    }, "nature/update")
  }

  function updateCheckStatus(index: number) {
    setNature(nature.map((n, currentIndex) => currentIndex === index ? { ...n, checked: !n.checked } : n))
  }

  useEffect(() => {
    getAllNatures()
  }, [])

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="white" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" color="gray.500" fontWeight="normal">
              Naturezas
            </Heading>

            <NextLink href="/nature/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar Natureza
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner color="blue.200"/>
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text color="gray.500">Falha em obter dados das naturezas</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead bg="blue.500">
                  <Tr>
                    <Th px={["4", "4", "8"]} color="white" width="8">
                      <Checkbox colorScheme="white" />
                    </Th>
                    <Th color="white">Natureza</Th>
                    {isWideVersion && <Th color="white">Data de cadastro</Th>}
                    <Th width="8" color="white">Ações</Th>
                  </Tr>
                </Thead>

                <Tbody bg="white.300">

                  {nature.map((n, index) => {
                    return (
                      <Tr borderBottomColor="gray.400" borderBottomWidth={2} w="full" key={n.id}>
                        <Td px={["4", "4", "8"]}>
                          <Checkbox
                            colorScheme="blue"
                            key={n.id}
                            checked={n.checked}
                            onChange={() => updateCheckStatus(index)}
                          />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="white" onMouseEnter={() => console.log("")}>
                              <Text color="gray.500" fontWeight="bold">{n.natureza}</Text>
                            </Link>
                          </Box>
                        </Td>
                        {isWideVersion && <Td color="gray.500" fontWeight="bold">{convertTimeStampToString(n.created_at)}</Td>}
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
                                onClick={() => handleUpdatePageNature(n.id, n.natureza)}
                              >
                                {isWideVersion ? 'Editar Natureza' : ''}
                              </Button>
                            </Box>
                            {n.checked ? (
                              <Box>
                                <Button
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  colorScheme="red"
                                  cursor="pointer"
                                  leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                                  onClick={() => deleteNature(n.id)}
                                >
                                  {isWideVersion ? 'Excluir Natureza' : ''}
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
                totalCountOfRegisters={nature.length}
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