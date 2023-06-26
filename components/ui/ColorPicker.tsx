import useClickOutside from '@/hooks/useClickOutside';
import { Box, Input, Text } from '@chakra-ui/react';
import React, { useCallback, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

export const ColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const popover = useRef<HTMLDivElement | null>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <Box pos={'relative'} display={'flex'}>
      <Box
        w="28px"
        h="28px"
        borderLeftRadius={'md'}
        border={'1px solid #fff'}
        boxShadow={'sm'}
        bgColor={color}
        cursor={'pointer'}
        onClick={() => toggle(true)}
      />
      <Input
        bgColor={'white'}
        fontSize={'sm'}
        h="28px"
        w="96px"
        py="1"
        border="none"
        borderLeft={'1px'}
        borderColor={color === '#ffffff' ? 'gray.200' : 'transparent'}
        borderRightRadius={'md'}
        boxShadow={'sm'}
        borderLeftRadius={0}
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />

      {isOpen && (
        <Box
          pos={'absolute'}
          top={'calc(100% + 2px)'}
          left={0}
          borderRadius={'md'}
          boxShadow={'lg'}
          ref={popover}
          zIndex={'10'}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </Box>
      )}
    </Box>
  );
};
