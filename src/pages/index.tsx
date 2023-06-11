import { Flex, Button, Stack, Box, Center, Divider, InputGroup, InputLeftAddon, Icon, Input, InputLeftElement, Text, FormErrorMessage, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useRouter } from 'next/router'
import Image from 'next/image'

import logo from "../../public/assets/logo.png";
import logoSap from "../../public/assets/logoSap.jpg";

import { MdOutlineEmail } from "react-icons/md";
import { BiLockAlt } from "react-icons/bi";
import Link from 'next/link'

import { AuthContext } from '../contexts/FirebaseAuthenticationContext'
import { useContext } from 'react'

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
})

export default function SignIn() {
  const { loginWithEmailPassword } = useContext(AuthContext);
  const toast = useToast();
  const router = useRouter()

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  })

  const { errors } = formState;


  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    loginWithEmailPassword(values.email, values.password);
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

        <Stack spacing={4}>
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

          <InputGroup size="lg">
            <InputLeftElement children={<Icon as={BiLockAlt} color="gray.300" fontSize={20} />} />
            <Input
              name="password"
              type="password"
              color="gray.300"
              _placeholder={{
                fontSize: 15,
                color: "gray.300"
              }}
              placeholder='Senha'
              {...register("password")}
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
          Entrar
        </Button>

        <Center justifyContent="space-between" flexDir="row" mt={10}>
          <Link href="/register">
            <Text color="blue.200">Cadastrar</Text>
          </Link>
          <Link href="/recover">
            <Text color="blue.200">Esqueceu a senha?</Text>
          </Link>
        </Center>
      </Flex>
    </Flex >
  )
}
