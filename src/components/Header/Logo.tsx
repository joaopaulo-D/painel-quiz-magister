import { Text } from "@chakra-ui/react";

export function Logo() {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
      color="blue.200"
    >
      QUIZ
      <Text as="span" ml="1" color="blue.200">.</Text>
    </Text>
  )
}