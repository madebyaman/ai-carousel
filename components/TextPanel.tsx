import WebFont from 'webfontloader';
import { FabricJSEditor } from 'fabricjs-react';
import SecondaryButton from './ui/SecondaryButton';
import { Box, Flex, Heading, Select, Text } from '@chakra-ui/react';
import { ColorPicker } from './ui/ColorPicker';
import React from 'react';
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
} from 'react-icons/ai';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { fabric } from 'fabric';
import { isRgbColor, rgbToHex } from '@/utils/color';

const FONTS = ['Inter', 'Roboto', 'Montserrat', 'Lato', 'Oswald'];

export default function TextPanel({
  editor,
  saveCanvas,
}: {
  editor: FabricJSEditor | null | undefined;
  saveCanvas: () => void;
}) {
  const [color, setColor] = React.useState('#000000');
  const [selectedFont, setSelectedFont] = React.useState(FONTS[0]);

  const bringToFront = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      activeObject.bringToFront();
      editor?.canvas.renderAll();
    }
  };

  const sendToBack = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      activeObject.sendToBack();
      editor?.canvas.renderAll();
    }
  };

  const onAddText = () => {
    const text = new fabric.IText('Hello, World!', { left: 10, top: 10 });
    editor?.canvas.add(text);
  };

  const isTextSelected = React.useMemo(() => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      return activeObject instanceof fabric.Text;
    }
    return false;
  }, [editor]);

  React.useEffect(() => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject instanceof fabric.Text) {
        const currentcolor = activeObject.fill;
        if (typeof currentcolor === 'string') {
          const newColor = isRgbColor(currentcolor)
            ? rgbToHex(currentcolor)
            : color;
          if (newColor !== color) {
            setColor(newColor);
          }
        } else if (color !== '#000000') {
          setColor('#000000');
        }
      } else if (color !== '#000000') {
        setColor('#000000');
      }
    }
  }, [editor, color]);

  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      selectedFont
    )}&display=swap`;
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    // Clean up after component unmount
    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFont]);

  const changeTextColor = (color: string) => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject instanceof fabric.Text) {
        activeObject.set({ fill: color });
        editor.canvas.renderAll();
        saveCanvas();
      }
    }
  };

  // React.useEffect(() => {
  //   if (editor && editor.canvas) {
  //     const activeObject = editor.canvas.getActiveObject();
  //     if (activeObject instanceof fabric.Text) {
  //       activeObject.set({ fontFamily: selectedFont });
  //       editor.canvas.requestRenderAll();
  //       saveCanvas();
  //     }
  //   }
  // }, [selectedFont, editor]);
  const getFontFamily = () => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        return (activeObject as fabric.IText).get('fontFamily');
      }
    }
    return 'Inter'; // replace with your default font family
  };

  const changeFontFamily = (fontFamily: string) => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        WebFont.load({
          google: {
            families: [fontFamily],
          },
          active: () => {
            // Set the font family when the font has been loaded
            (activeObject as fabric.IText).set({ fontFamily });
            editor.canvas.requestRenderAll();
            saveCanvas();
          },
        });
      }
    }
  };

  return (
    <div>
      <Heading as="h1" size="lg" mb="5">
        Text
      </Heading>
      {isTextSelected ? (
        <>
          <Flex gap="1" flexDir={'column'} mb="3">
            <Text>Text Color</Text>
            <ColorPicker
              label="Text Color"
              color={color} // Use state for displaying the color
              onChange={changeTextColor}
            />
          </Flex>
          <Select
            value={getFontFamily()}
            onChange={(e) => changeFontFamily(e.target.value)}
          >
            {FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </Select>
          <Box
            as={ToggleGroup.Root}
            display={'inline-flex'}
            borderRadius={'md'}
            boxShadow={'sm'}
            type="single"
            defaultValue="center"
            aria-label="Text alignment"
          >
            <Box
              as={ToggleGroup.Item}
              bgColor={'white'}
              textColor={'gray.500'}
              height={'40px'}
              width={'40px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              lineHeight={1}
              marginLeft={'1px'}
              value="left"
              aria-label="Left aligned"
            >
              <AiOutlineAlignLeft />
            </Box>
            <Box
              as={ToggleGroup.Item}
              bgColor={'white'}
              textColor={'gray.500'}
              height={'40px'}
              width={'40px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              lineHeight={1}
              marginLeft={'1px'}
              value="center"
              aria-label="Left aligned"
            >
              <AiOutlineAlignCenter />
            </Box>
            <Box
              as={ToggleGroup.Item}
              bgColor={'white'}
              textColor={'gray.500'}
              height={'40px'}
              width={'40px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              lineHeight={1}
              marginLeft={'1px'}
              value="right"
              aria-label="Left aligned"
            >
              <AiOutlineAlignRight />
            </Box>
          </Box>
        </>
      ) : (
        <SecondaryButton width={'full'} mb="3" onClick={onAddText}>
          Add Text
        </SecondaryButton>
      )}
    </div>
  );
}
