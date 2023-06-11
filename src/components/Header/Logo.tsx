import { Box, Text } from "@chakra-ui/react";

import Image from "next/image";
import logo from "../../../public/assets/logo.png"

export function Logo() {
  return (
    <Box
      w="64"
    >
      <Image
        src={logo}
        width={80}
        height={80}
        alt="logo"
      />
    </Box>
  )
}