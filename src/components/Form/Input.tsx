import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react'

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: any;
}

const InputBase:ForwardRefRenderFunction<HTMLInputElement, InputProps>
  = ({ name, label, error = null, ...rest }, ref) => {
    return (
      <FormControl isInvalid={!!error}>
        { !!label && <FormLabel htmlFor={name} color="gray.500">{label}</FormLabel> }

        <ChakraInput
          id={name}
          name={name}
          focusBorderColor="blue.200"
          bgColor="gray.100"
          variant="filled"
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

export const Input = forwardRef(InputBase)