import React, { ForwardRefRenderFunction } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface TertiaryButtonProps extends ButtonProps {
  // You can add other props here if needed.
}

const TertiaryButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  TertiaryButtonProps
> = (props, ref) => {
  return (
    <Button
      bgColor="transparent"
      borderWidth={1}
      borderColor="gray.300"
      fontSize={'sm'}
      px="3"
      py="1"
      textColor={'gray.800'}
      borderRadius={'sm'}
      boxShadow={'sm'}
      fontWeight={'normal'}
      _hover={{ borderColor: 'gray.500' }}
      ref={ref}
      {...props}
    />
  );
};

export default React.forwardRef(TertiaryButton);
