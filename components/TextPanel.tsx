import { FabricJSEditor } from 'fabricjs-react';
import SecondaryButton from './ui/SecondaryButton';
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import { ColorPicker } from './ui/ColorPicker';
import React from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import { fabric } from 'fabric';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';
import { isRgbColor, rgbToHex } from '@/utils/color';
import FontFaceObserver from 'fontfaceobserver';

const FONTS = ['Inter', 'Roboto', 'Montserrat', 'Lato', 'Oswald'];

export default function TextPanel({
  editor,
  saveCanvas,
}: {
  editor: FabricJSEditor | null | undefined;
  saveCanvas: () => void;
}) {
  const loadFont = (fontName: string) => {
    return new Promise((resolve, reject) => {
      // Remove the old font link if it exists
      const oldLink = document.querySelector('#dynamic-font');
      oldLink && oldLink.parentNode?.removeChild(oldLink);

      // Create a new link element
      const link = document.createElement('link');
      link.id = 'dynamic-font';
      link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(
        ' ',
        '+'
      )}&display=swap`;
      link.rel = 'stylesheet';

      // Append the new link element to the head of the document
      document.head.appendChild(link);

      // Resolve the promise once the font has been loaded
      link.onload = () => resolve(null);
      link.onerror = () => reject(new Error('Failed to load font'));
    });
  };

  const [textProps, setTextProps] = React.useState({
    color: '#000000',
    fontSize: 14,
    isBold: false,
    isItalic: false,
    textBackgroundColor: '#ffffff',
    fontFamily: 'Inter',
    loadingFont: false,
  });

  const {
    color,
    fontSize,
    loadingFont,
    isBold,
    isItalic,
    textBackgroundColor,
    fontFamily,
  } = textProps;

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

  React.useEffect(() => {
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject instanceof fabric.IText) {
        const currentFont = activeObject.get('fontFamily');
        const currentColor = activeObject.get('fill');
        const currentSize = activeObject.get('fontSize');
        const currentWeight = activeObject.get('fontWeight');
        const currentStyle = activeObject.get('fontStyle');
        const currentBgColor = activeObject.get('textBackgroundColor');

        setTextProps({
          ...textProps,
          color: isRgbColor(currentColor) ? rgbToHex(currentColor) : color,
          fontFamily: currentFont ?? fontFamily,
          fontSize: currentSize ?? fontSize,
          isBold: currentWeight === 'bold',
          isItalic: currentStyle === 'italic',
          textBackgroundColor: isRgbColor(currentBgColor)
            ? rgbToHex(currentBgColor)
            : textBackgroundColor,
        });
      }
    }
  }, [editor]);

  // Update properties on user interaction
  const updateTextProps = async (newProps) => {
    setTextProps((prevProps) => ({ ...prevProps, ...newProps }));
    if (editor && editor.canvas) {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject instanceof fabric.IText) {
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
            activeObject.set('fontFamily', font);
            editor.canvas.renderAll();
          } catch (error) {
            console.error('Failed to load font:', error);
            return;
          }
        }
        console.log(updatedProps);
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
                  bgColor: 'blue.50',
                  boxShadow: 'lg',
                },
                '&[data-state="on"]:hover': {
                  bgColor: 'blue.50',
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
                  bgColor: 'blue.50',
                  boxShadow: 'lg',
                },
                '&[data-state="on"]:hover': {
                  bgColor: 'blue.50',
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
              label="Text Color"
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
            <Slider
              min={10}
              max={72}
              value={fontSize}
              onChange={(newSize) => updateTextProps({ fontSize: newSize })}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Text>Text Background Color</Text>
          <ColorPicker
            label="Text background color"
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
