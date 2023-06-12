import React from "react";
import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { Alternative } from "../../dtos/Question";

interface ModalViewQuestionProps {
  question: Alternative;
  onClose: () => void;
  isOpen: boolean;
}

export function ModalViewQuestion({ question, isOpen, onClose }: ModalViewQuestionProps) {

  const letras = ["a", "b", "c", "d", "e"]

  return (
    <Modal onClose={onClose} size={"xl"} isOpen={isOpen}>
      <ModalOverlay/>
      <ModalContent bg="white">
        <ModalHeader color="gray.600" mt={8} fontSize={18} textAlign="justify">{question.title}</ModalHeader>
        <ModalCloseButton color="gray.600"/>
        <ModalBody>
          {question.alternatives.map((str, index) => (
            <HStack>
              <Text key={index} color="gray.500">{`${letras[index]}) `}</Text>
              <Text key={index} color="gray.500">{str}</Text>
            </HStack>
          ))}
          <VStack mt={10}>
            <Text color="gray.500">Alternativa correta para essa questão é: <strong>{`${letras[question.correct]}) ${question.alternatives[question.correct]}`}</strong>.</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="red">Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}