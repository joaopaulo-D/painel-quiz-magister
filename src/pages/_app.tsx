import { useContext, useEffect } from 'react'

import { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'

import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { FirebaseAuthenticationContextProvider } from '../contexts/FirebaseAuthenticationContext';

import { firebase } from "../firebase/firebase";

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        router.push("/dashboard")
      }else{
        router.push("/")
      }
    })
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <FirebaseAuthenticationContextProvider>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </FirebaseAuthenticationContextProvider>
    </ChakraProvider>
  )
}

export default MyApp