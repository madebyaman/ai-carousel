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
      bgColor="gray.200"
      textColor={'gray.800'}
      _hover={{ bgColor: 'gray.300' }}
      ref={ref}
      {...props}
    />
  );
};

export default React.forwardRef(TertiaryButton);
