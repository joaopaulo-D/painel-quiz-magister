import { Flex, Button, Stack, Box, Center, Divider, InputGroup, InputLeftAddon, Icon, Input, InputLeftElement, Text, FormErrorMessage, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useRouter } from 'next/router'
import Image from 'next/image'

import logo from "../../public/assets/logo.png";
import logoSap from "../../public/assets/logoSap.jpg";

import { MdOutlineEmail } from "react-icons/md";
import { BiLockAlt, BiUser } from "react-icons/bi";
import Link from 'next/link'

import { AuthContext } from '../contexts/FirebaseAuthenticationContext'
import { useContext } from 'react'

type RecoverFormData = {
  email: string;
}

const RecoverFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
})

export default function Recover() {
  const { sendPasswordResetEmail } = useContext(AuthContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(RecoverFormSchema)
  })

  const { errors } = formState;


  const handleSignIn: SubmitHandler<RecoverFormData> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    sendPasswordResetEmail(values.email)
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      bg="white.300"
    >
      <Flex
        as="form"
        w="full"
        maxW={360}
        bg="white"
        p="8"
        borderRadius={4}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Center flexDir="row" mb={50}>
          <Box>
            <Image
              src={logoSap}
              width={150}
              height={150}
              alt="logoFATEPI"
            />
          </Box>
          <Box ml={10}>
            <Image
              src={logo}
              width={80}
              height={80}
              alt="logoQuizMagister"
            />
          </Box>
        </Center>

        <Divider w="full" mb={5}/>

        <Center mb={5}>
          <Text fontSize={18} color="gray.400">Esqueceu sua senha?</Text>
        </Center>

        <Divider w="full" mb={5}/>

        <Stack spacing={4}>
          <Text fontSize={15} color="gray.200" textAlign="justify">
            Digite seu email, em seguida clique no botão enviar. Uma link de redefinição da sua senha será enviado para o email cadastrado.
          </Text>
          <InputGroup size="lg">
            <InputLeftElement children={<Icon as={MdOutlineEmail} color="gray.300" fontSize={20} />} />
            <Input
              name="email"
              type="email"
              color="gray.300"
              _placeholder={{
                fontSize: 15,
                color: "gray.300"
              }}
              placeholder='E-mail'
              {...register("email")}
            />
          </InputGroup>
        </Stack>

        <Button
          type="submit"
          mt={6}
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Enviar
        </Button>

        <Center flexDir="row" mt={10}>
          <Link href="/">
            <Text color="blue.200">Voltar</Text>
          </Link>
        </Center>
      </Flex>
    </Flex >
  )
}
