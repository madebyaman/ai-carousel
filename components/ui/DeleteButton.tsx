import React, { ForwardRefRenderFunction } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { IoTrash } from 'react-icons/io5';

interface DeleteButtonProps extends ButtonProps {
  // You can add other props here if needed.
}

const DeleteButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  DeleteButtonProps
> = (props, ref) => {
  return (
    <Button
      bgColor="white"
      textColor={'red.700'}
      _hover={{ bgColor: 'red.200' }}
      ref={ref}
      leftIcon={<IoTrash />}
      {...props}
    />
  );
};

export default React.forwardRef(DeleteButton);
