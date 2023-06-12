import { useState } from 'react'
import { Box, Flex, SimpleGrid, Text, theme } from '@chakra-ui/react'

import { BsPerson } from 'react-icons/bs'
import { MdQuiz } from "react-icons/md"
import { FaUsers, FaUser } from "react-icons/fa"

import { Header } from "../components/Header"
import { Sidebar } from '../components/Sidebar'
import CardStatistics from '../components/CardStatistics'

export default function Dashboard() {

  const [questions, setQuestions] = useState(0);
  const [disciplines, setDisciplines] = useState(0);

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid flex="1" gap="4" columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          <CardStatistics
            icon={<MdQuiz size={'3em'} />}
            value={questions}
            title='Questões'
            color="blue.200"
          />
          <CardStatistics
            icon={<FaUsers size={'3em'} />}
            value={0}
            title='Alunos'
            color="red.300"
          />
          <CardStatistics
            icon={<FaUsers size={'3em'} />}
            value={0}
            title='Professores'
            color="green.400"
          />
          <CardStatistics
            icon={<BsPerson size={'3em'} />}
            value={disciplines}
            title='Disciplinas'
            color="gray.200"
          />
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}