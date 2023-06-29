import React, { useState } from 'react';
import { Box, Button, Input, Flex } from '@chakra-ui/react';
import { IoAdd, IoRemove } from 'react-icons/io5';

const NumberChanger = ({
  number,
  setNumber,
}: {
  number: number;
  setNumber: (n: number) => void;
}) => {
  const handleIncrement = () => {
    setNumber(number + 1);
  };

  const handleDecrement = () => {
    if (number > 0) {
      setNumber(number - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    if (isNaN(newValue)) {
      setNumber(0);
    } else {
      setNumber(newValue);
    }
  };

  return (
    <Flex
      gap={0}
      border="1px"
      display={'inline-flex'}
      borderColor={'gray.800'}
      borderRadius={'md'}
    >
      <Button onClick={handleIncrement} bgColor={'transparent'} p="1">
        <IoAdd />
      </Button>
      <Input
        value={number}
        onChange={handleInputChange}
        borderLeft={'1px'}
        borderRight={'1px'}
        borderBottom={'0px'}
        borderTop={'0px'}
        borderColor={'gray.800'}
        borderRadius={'0px'}
        type="number"
        w="55px"
      />
      <Button onClick={handleDecrement} bgColor={'transparent'} p="1">
        <IoRemove />
      </Button>
    </Flex>
  );
};

export default NumberChanger;
