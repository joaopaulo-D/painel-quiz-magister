import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link, Badge, HStack } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { firebase } from "../../firebase/firebase";
import { User } from "../../dtos/User";
import { convertTimeStampToString } from "../../utils/date";

export default function UserList({ users }) {
  const [page, setPage] = useState(1);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState("")

  const [data, setData] = useState<User[]>([])

  const getDataUserAuthenticated = async () => {
    try {  
      setIsLoading(true)
      const response = await firebase.firestore().collection("users").onSnapshot((doc) => {
        doc.docs.forEach((doc) => {
          const data = doc.data()
          setData([{
            id: data.id,
            name: data.name,
            email: data.email,
            teacher: data.teacher,
            created_at: data.created_at
          }])
        })
      })
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  // function updateCheckStatus(index: number) {
  //   setData(data.map((user, currentIndex) => currentIndex === index ? { ...user, checked: !user.checked } : user))
  // }

  useEffect(() => {
    getDataUserAuthenticated();
  }, [])

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="white" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading color="gray.500" size="lg" fontWeight="normal">
              Alunos e Professores

              {/* { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/> } */}
            </Heading>

            {/* <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar Usuário
              </Button>
            </NextLink> */}
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner color="blue.200"/>
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text color="gray.500">Falha em obter dados dos usuários</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead bg="blue.200">
                  <Tr>
                    {/* <Th px={["4", "4", "6"]} color="white" width="8">
                      <Checkbox colorScheme="white" />
                    </Th> */}
                    <Th color="white">Nome</Th>
                    <Th color="white">Função</Th>
                    {isWideVersion && <Th color="white">Data de cadastro</Th>}
                    {/* <Th width="8" color="white">Ações</Th> */}
                  </Tr>
                </Thead>

                <Tbody bg="white.300">

                  {data.map((user, index) => {
                    return (
                      <Tr key={user.id} borderBottomColor="gray.400" borderBottomWidth={2}>
                        {/* <Td px={["4", "4", "6"]}>
                          <Checkbox
                            colorScheme="blue"
                            key={user.id}
                            checked={user.checked}
                            onChange={() => updateCheckStatus(index)}
                          />
                        </Td> */}
                        <Td>
                          <Box>
                            <Link color="white" onMouseEnter={() => console.log("")}>
                              <Text fontWeight="bold" color="gray.500">{user.teacher ? `Professor: ${user.name}` : `Aluno: ${user.name}`}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">Email: {user.email}</Text>
                          </Box>
                        </Td>
                        <Td>
                          <Badge colorScheme="orange">{user.teacher ? "Professor" : "Aluno"}</Badge>
                        </Td>
                        {isWideVersion && <Td color="gray.500" fontWeight="bold">{convertTimeStampToString(user.created_at)}</Td>}
                        {/* <Td>
                          <HStack>
                            <Box>
                              <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="blue"
                                cursor="pointer"
                                leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                              >
                                {isWideVersion ? 'Editar usuário' : ''}
                              </Button>
                            </Box>
                            {user.checked ? (
                              <Box>
                                <Button
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  colorScheme="red"
                                  cursor="pointer"
                                  leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                                >
                                  {isWideVersion ? 'Excluir usuário' : ''}
                                </Button>
                              </Box>
                            ) : null}
                          </HStack>
                        </Td> */}
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