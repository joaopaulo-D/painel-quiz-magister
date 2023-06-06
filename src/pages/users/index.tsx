import { useState } from "react";
import NextLink from "next/link";
import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link, Badge, HStack } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { GetServerSideProps } from "next";

export default function UserList({ users }) {
  const [page, setPage] = useState(1);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, serError] = useState("")

  const [data, setData] = useState([
    {
      id: 1,
      name: "Fernando Silva",
      email: "tugrp@example.com",
      funcao: "Professor",
      createdAt: "21/05/2002",
      checked: false
    },
    {
      id: 2,
      name: "Maria Luiza",
      email: "maria@example.com",
      funcao: "Aluna",
      createdAt: "21/05/2006",
      checked: false
    }
  ])

  function updateCheckStatus(index: number) {
    setData(data.map((user, currentIndex) => currentIndex === index ? { ...user, checked: !user.checked } : user))
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários

              {/* { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/> } */}
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar Usuário
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha em obter dados dos usuários</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="blue" />
                    </Th>
                    <Th>Usuários</Th>
                    <Th>Função</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    <Th width="8">Ações</Th>
                  </Tr>
                </Thead>

                <Tbody>

                  {data.map((user, index) => {
                    return (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox
                            colorScheme="blue"
                            key={user.id}
                            checked={user.checked}
                            onChange={() => updateCheckStatus(index)}
                          />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="white" onMouseEnter={() => console.log("")}>
                              <Text fontWeight="bold">{user.name}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">{user.email}</Text>
                          </Box>
                        </Td>
                        <Td>
                          <Badge colorScheme="orange">{user.funcao}</Badge>
                        </Td>
                        {isWideVersion && <Td>{user.createdAt}</Td>}
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