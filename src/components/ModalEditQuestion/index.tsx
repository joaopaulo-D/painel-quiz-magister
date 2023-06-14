import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea
} from "@chakra-ui/react";
import { Alternative } from "../../dtos/Question";
import { useRouter } from "next/router";

import { firebase } from "../../firebase/firebase";

interface ModalEditQuestionProps {
  data: {
    id: string;
    data_question: Alternative,
    index: number;
    discipline: string;
  };
  onClose: () => void;
  isOpen: boolean;
}

export function ModalEditQuestion({ isOpen, onClose, data }: ModalEditQuestionProps) {

  console.log(data)

  const [alternativeCorrect, setAlternativeCorrect] = useState<string>(data.data_question.correct);
  const [alternatives, setAlternatives] = useState<string[]>(data.data_question.alternatives);
  const [questao, setQuestao] = useState<string>(data.data_question.title);

  const router = useRouter();

  const handleChange = (event: any, index: number) => {
    const newAlternativas = [...alternatives];
    newAlternativas[index] = event.target.value;
    setAlternatives(newAlternativas);
  };

  const handleEditQuestion = async () => {
    try {
      const response = await firebase.firestore().collection("questions").doc(data.id).get();

      if (response.exists) {
        const array = response.data().questions;

        array[data.index] = {
          alternatives: [...alternatives],
          correct: alternativeCorrect,
          title: questao
        };

        firebase.firestore().collection("questions").doc(data.id).update({ questions: array })
          .then(() => {
            window.alert('Questão atualizada com sucesso!');
          })
          .catch(error => {
            window.alert(`Erro ao atualizar a questão: ${error}`);
          });
      }

      onClose()

    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"xl"}
    >
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader color="gray.800">Atualizar Questão de {data.discipline}</ModalHeader>
        <ModalCloseButton color="gray.500" />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel color="gray.500">Questão</FormLabel>
            <Textarea focusBorderColor="blue.200"
              bgColor="gray.50"
              _placeholder={{
                color: "gray.200",
              }}
              placeholder='Questão'
              color="gray.500"
              h={55}
              defaultValue={data.data_question.title}
              onChange={(value) => setQuestao(value.target.value)}
            />
          </FormControl>

          {data.data_question.alternatives.map((alternative, index) => (
            <FormControl mt={4}>
              <FormLabel color="gray.500">Alternativa {index + 1}</FormLabel>
              <Input focusBorderColor="blue.200"
                bgColor="gray.50"
                size="lg"
                _placeholder={{
                  color: "gray.200",
                  fontSize: 15
                }}
                color="gray.500"
                placeholder='alternativa 1'
                defaultValue={alternative}
                onChange={(event) => handleChange(event, index)}
              />
            </FormControl>
          ))}

          <FormControl>
            <FormLabel mb={2} color="gray.500">Alternativa Correta</FormLabel>
            <Select 
            bg="white" 
            placeholder='Selecione a alternativa correta' 
            color="gray.500" 
            size={"lg"} 
            defaultValue={data.data_question.correct} 
            borderColor="blue.200" 
            borderWidth={2}
            onChange={(value) => setAlternativeCorrect(value.target.value)}
            >
              <option style={{ color: "gray" }} value='0'>Alternativa 1</option>
              <option style={{ color: "gray" }} value='1'>Alternativa 2</option>
              <option style={{ color: "gray" }} value='2'>Alternativa 3</option>
              <option style={{ color: "gray" }} value='3'>Alternativa 4</option>
              <option style={{ color: "gray" }} value='4'>Alternativa 5</option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleEditQuestion}>
            Atualizar
          </Button>
          <Button colorScheme='red' onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}