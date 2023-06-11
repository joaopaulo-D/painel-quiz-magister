import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import { FormControl, FormErrorMessage, FormLabel, Textarea as ChakraTextArea, TextareaProps as ChakraTextAreaProps } from '@chakra-ui/react'

interface TextAreaProps extends ChakraTextAreaProps {
  name: string;
  label?: string;
  error?: any;
}

const TextAreaBase:ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps>
  = ({ name, label, error = null, ...rest }, ref) => {
    return (
      <FormControl isInvalid={!!error}>
        { !!label && <FormLabel htmlFor={name} color="gray.500">{label}</FormLabel> }

        <ChakraTextArea
          id={name}
          name={name}
          focusBorderColor="blue.200"
          bgColor="gray.50"
          size="lg"
          color="gray.500"
          ref={ref}
          {...rest}
        />

        { !!error && (
          <FormErrorMessage>
            {error.message}
          </FormErrorMessage>
        ) }
      </FormControl>
    )
}

export const TextArea = forwardRef(TextAreaBase)