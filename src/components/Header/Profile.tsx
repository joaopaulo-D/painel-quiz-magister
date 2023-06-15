import { useEffect, useState } from 'react';

import { Flex, Text, Box, Avatar } from '@chakra-ui/react'

import { firebase } from "../../firebase/firebase";
import { User } from '../../dtos/User';
import { Error } from '../../utils/errors';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {

  const [user, setUser] = useState<User[]>([]);

  const getDataUserAuthenticated = async () => {
    try {
      const response = await firebase.firestore().collection("users").doc(firebase.auth().currentUser?.uid).get()
      const data = response.data()

      setUser([{
        id: data.id,
        name: data.name,
        email: data.email,
        teacher: data.teacher,
        created_at: data.created_at
      }])

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataUserAuthenticated();
  }, [])

  return (
    <Flex align="center">
      {showProfileData && (
        <>
          {user.map((u, index) => (
            <>
              <Box mr="4" textAlign="right">
                <Text color="gray.400">{u.name}</Text>
                <Text color="gray.300" fontSize="small">
                  {u.email}
                </Text>
              </Box>
              <Avatar size="md" name={u.name} src="" borderColor="blue.200" borderWidth={2} />
            </>
          ))}
        </>

      )}
    </Flex>
  )
}