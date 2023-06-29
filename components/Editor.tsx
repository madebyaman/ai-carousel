import React from 'react';
import { Box } from '@chakra-ui/react';

import { FabricJSCanvas, FabricJSEditor } from 'fabricjs-react';
import { Canvas } from 'fabric/fabric-impl';

const Editor = ({
  editor,
  onReady,
}: {
  editor: FabricJSEditor | undefined;
  onReady: (canvas: Canvas) => void;
}) => {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box
        as={FabricJSCanvas}
        width={'512px'}
        height={'512px'}
        placeSelf={'center'}
        className="sample-canvas"
        backgroundColor={'white'}
        boxShadow={'md'}
        onReady={onReady}
      />
    </Box>
  );
};

export default Editor;
