import React, { ForwardRefRenderFunction } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface PrimaryButtonProps extends ButtonProps {}

const PrimaryButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  PrimaryButtonProps
> = (props, ref) => {
  return (
    <Button
      textColor={'white'}
      ref={ref}
      px={10}
      py={6}
      mb="8"
      outline={'5px solid rgba(0, 102, 255, 0.2)'}
      fontSize={'xl'}
      fontWeight="bold"
      color="white"
      bgColor="rgb(0, 102, 255)"
      _hover={{
        bgColor: 'rgba(0, 102, 255, 0.8)',
      }}
      {...props}
    />
  );
};

export default React.forwardRef(PrimaryButton);
