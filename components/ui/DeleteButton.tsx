import React, { ForwardRefRenderFunction } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { IoTrashBin } from 'react-icons/io5';

interface DeleteButtonProps extends ButtonProps {}

const DeleteButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  DeleteButtonProps
> = (props, ref) => {
  return (
    <Button
      bgColor="rgba(255, 255, 255, 0.8)"
      textColor={'red.700'}
      _hover={{ bgColor: 'red.200' }}
      ref={ref}
      leftIcon={<IoTrashBin />}
      {...props}
    />
  );
};

export default React.forwardRef(DeleteButton);
