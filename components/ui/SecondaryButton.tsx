import React, { ForwardRefRenderFunction } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface SecondaryButtonProps extends ButtonProps {
  // You can add other props here if needed.
}

const SecondaryButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  SecondaryButtonProps
> = (props, ref) => {
  return (
    <Button
      bgColor="gray.800"
      textColor={'white'}
      _hover={{ bgColor: 'gray.600' }}
      ref={ref}
      {...props}
    />
  );
};

export default React.forwardRef(SecondaryButton);
