import { Flex, Text, Box, Avatar } from '@chakra-ui/react'

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align="center">
      { showProfileData && (
        <Box mr="4" textAlign="right">
          <Text color="gray.400">João Paulo</Text>
          <Text color="gray.300" fontSize="small">
            joaopaulo@gmail.com
          </Text>
        </Box>
      )}

      <Avatar size="md" name="joao" src="" borderColor="blue.200" borderWidth={2}/>
    </Flex>
  )
}