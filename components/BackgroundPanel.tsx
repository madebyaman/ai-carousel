// CanvasBackground.tsx
import React, { useEffect, useState } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { FabricJSEditor } from 'fabricjs-react';
import { ColorPicker } from './ui/ColorPicker';
import { useSnapshot } from 'valtio';
import { state } from '@/utils/editorState';

export default function BackgroundPanel({
  editor,
  saveCanvas,
}: {
  editor: FabricJSEditor | null | undefined;
  saveCanvas: () => void;
}) {
  const snap = useSnapshot(state);
  const { activeIndex, editorState } = snap;
  const color = editorState[activeIndex].bgColor;

  const changeBackgroundColor = (color: string) => {
    if (editor && editor.canvas) {
      editor.canvas.setBackgroundColor(color, () => {
        editor.canvas.renderAll();
        saveCanvas();
        state.editorState[activeIndex].bgColor = color;
      });
    }
  };

  return (
    <>
      <Heading as="h1" size="lg" mb="5">
        Background
      </Heading>
      <Flex gap="1" flexDir={'column'}>
        <Text>Background Color</Text>
        <ColorPicker
          label="Background Color"
          color={color} // Use state for displaying the color
          onChange={changeBackgroundColor}
        />
      </Flex>
    </>
  );
}
