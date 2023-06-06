import { Stat, StatNumber, StatLabel, Flex, useColorModeValue, Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  color: string;
  icon: ReactNode;
}

export default function CardStatistics(props: StatsCardProps) {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      rounded={'lg'}
      bg={'white'}
    >
      <Flex justifyContent="space-between">
        <Box>
          <StatLabel color="gray.500" fontWeight={'bold'} isTruncated>
            {props.title}
          </StatLabel>
          <StatNumber color="gray.500" fontWeight={'bold'}>
            {props.value}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          bg={props.color}
          p={2}
          alignItems={'center'}
          rounded={8}
        >
          {props.icon}
        </Box>
      </Flex>
    </Stat>
  )
}