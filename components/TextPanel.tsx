import { FabricJSEditor } from 'fabricjs-react';
import SecondaryButton from './ui/SecondaryButton';
import { Box, Flex, Heading, Select, Text } from '@chakra-ui/react';
import { ColorPicker } from './ui/ColorPicker';
import React, { useEffect } from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import { fabric } from 'fabric';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';
import { isHexColor, isRgbColor, rgbToHex } from '@/utils/color';
import FontFaceObserver from 'fontfaceobserver';
import NumberChanger from './ui/NumberChange';
import DeleteButton from './ui/DeleteButton';
import TertiaryButton from './ui/TertiaryButton';
import { IoTrashBin } from 'react-icons/io5';

const FONTS = [
  'Inter',
  'Roboto',
  'Montserrat',
  'Lato',
  'Oswald',
  'Open Sans',
  'Ubuntu',
  'Raleway',
  'Merriweather',
  'Nunito',
  'Dancing Script',
  'Abril Fatface',
  'Pacifico',
  'Playfair Display',
  'Bitter',
  'DM Sans',
];

export default function TextPanel({
  editor,
  saveCanvas,
}: {
  editor: FabricJSEditor | null | undefined;
  saveCanvas: () => void;
}) {
  const [textProps, setTextProps] = React.useState({
    color: '#000000',
    fontSize: 14,
    isBold: false,
    isItalic: false,
    textBackgroundColor: '#ffffff',
    fontFamily: 'Inter',
  });

  const { color, fontSize, isBold, isItalic, textBackgroundColor, fontFamily } =
    textProps;

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
    const object = new fabric.Textbox('Hello world');
    editor?.canvas.add(object);
    editor?.canvas.setActiveObject(object);
    saveCanvas();
  };

  const isTextSelected = React.useMemo(() => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      return activeObject instanceof fabric.Text;
    }
    return false;
  }, [editor]);

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

  useEffect(() => {
    editor?.canvas.on('object:modified', function (e) {
      let activeObject = e.target;
      if (!activeObject) return;
    });
  }, []);

  React.useEffect(() => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject && activeObject instanceof fabric.Text) {
        const currentFont = activeObject.fontFamily;
        const currentColor = activeObject.fill;
        const currentSize = activeObject.fontSize;
        const currentWeight = activeObject.fontWeight;
        const currentStyle = activeObject.fontStyle;
        const currentBgColor = activeObject.textBackgroundColor;

        setTextProps({
          ...textProps,
          color: isHexColor(currentColor)
            ? currentColor
            : isRgbColor(currentColor)
            ? rgbToHex(currentColor)
            : color,
          fontFamily: currentFont ?? fontFamily,
          fontSize: currentSize ?? fontSize,
          isBold: currentWeight === 'bold',
          isItalic: currentStyle === 'italic',
          textBackgroundColor: isHexColor(currentBgColor)
            ? currentBgColor
            : isRgbColor(currentBgColor)
            ? rgbToHex(currentBgColor)
            : textBackgroundColor,
        });
      }
    }
  }, [editor]);

  // Update properties on user interaction
  const updateTextProps = async (newProps: any) => {
    setTextProps((prevProps) => ({ ...prevProps, ...newProps }));
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject && activeObject instanceof fabric.Text) {
        const updatedProps = { ...newProps };
        if (updatedProps.color) {
          updatedProps.fill = updatedProps.color;
          delete updatedProps.color;
        }
        if (updatedProps.isBold !== undefined) {
          updatedProps.fontWeight = updatedProps.isBold ? 'bold' : 'normal';
          delete updatedProps.isBold;
        }
        if (updatedProps.isItalic !== undefined) {
          updatedProps.fontStyle = updatedProps.isItalic ? 'italic' : 'normal';
          delete updatedProps.isItalic;
        }
        if (updatedProps.fontFamily) {
          const font = updatedProps.fontFamily;
          const fontUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
            font
          )}`;

          // Add the link element to load the font.
          const linkElement = document.createElement('link');
          linkElement.href = fontUrl;
          linkElement.rel = 'stylesheet';
          document.head.appendChild(linkElement);

          // Then wait for the font to load.
          const observer = new FontFaceObserver(font);
          try {
            await observer.load();
            // when font is loaded, use it.
            activeObject.fontFamily = font;
            editor.canvas.renderAll();
          } catch (error) {
            console.error('Failed to load font:', error);
            return;
          }
        }
        activeObject.set(updatedProps);
        editor.canvas.renderAll();
        saveCanvas();
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
          <Flex gap="1" mb="3">
            <Box
              as={Toggle.Root}
              bgColor={'transparent'}
              color={'gray.800'}
              height={'40px'}
              width={'40px'}
              borderRadius={'md'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              boxShadow={'sm'}
              fontSize={'15px'}
              _hover={{
                bgColor: 'gray.50',
              }}
              __css={{
                '&[data-state="on"]': {
                  bgColor: 'white',
                  boxShadow: 'lg',
                },
                '&[data-state="on"]:hover': {
                  bgColor: 'white',
                  boxShadow: 'lg',
                },
              }}
              aria-label="Toggle bold"
              pressed={isBold}
              onPressedChange={(val: boolean) => {
                return updateTextProps({ isBold: val });
              }}
            >
              <AiOutlineBold />
            </Box>
            <Box
              as={Toggle.Root}
              bgColor={'transparent'}
              color={'gray.800'}
              height={'40px'}
              width={'40px'}
              borderRadius={'md'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              fontSize={'15px'}
              _hover={{
                bgColor: 'gray.50',
              }}
              __css={{
                '&[data-state="on"]': {
                  bgColor: 'white',
                  boxShadow: 'lg',
                },
                '&[data-state="on"]:hover': {
                  bgColor: 'white',
                  boxShadow: 'lg',
                },
              }}
              aria-label="Toggle italic"
              pressed={isItalic}
              onPressedChange={(val: boolean) =>
                updateTextProps({ isItalic: val })
              }
            >
              <AiOutlineItalic />
            </Box>
          </Flex>
          <Flex gap="1" flexDir={'column'} mb="3">
            <Text>Text Color</Text>
            <ColorPicker
              color={color} // Use state for displaying the color
              onChange={(newColor) => updateTextProps({ color: newColor })}
            />
          </Flex>
          <Box mb="3">
            <Text>Font Family</Text>
            <Select
              value={fontFamily}
              onChange={(e) => updateTextProps({ fontFamily: e.target.value })}
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </Select>
          </Box>
          <Box mb="3">
            <Text>Font Size</Text>
            <NumberChanger
              number={fontSize}
              setNumber={(num) => updateTextProps({ fontSize: num })}
            />
          </Box>
          <Text>Text Background Color</Text>
          <ColorPicker
            color={textBackgroundColor}
            onChange={(newColor) =>
              updateTextProps({ textBackgroundColor: newColor })
            }
          />
        </>
      ) : (
        <SecondaryButton width={'full'} mb="3" onClick={onAddText}>
          Add Text
        </SecondaryButton>
      )}
    </div>
  );
}
