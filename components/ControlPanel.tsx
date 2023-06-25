import { Box } from '@chakra-ui/react';

export default function ControlPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      w={'25%'}
      py="5"
      px="10px"
      maxW="sm"
      borderRight={'1px'}
      borderColor={'gray.200'}
      bgColor={'gray.50'}
    >
      {children}
    </Box>
  );
}
