import { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import {
  Box,
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
import { RectangleSVG } from './ui/svgs/RectangleSVG';
import { CircleSVG } from './ui/svgs/Circle';
import { LineSVG } from './ui/svgs/LineSVG';
import { isHexColor, isRgbColor, rgbToHex } from '@/utils/color';
import SecondaryButton from './ui/SecondaryButton';
import { FabricJSEditor } from 'fabricjs-react';
import Image from 'next/image';

const svgList = [
  'underline.svg',
  'arrow.svg',
  'two-lines.svg',
  'heart.svg',
  'chat.svg',
  'star.svg',
];

const ShapePanel = ({
  editor,
  saveCanvas,
}: {
  editor: FabricJSEditor | null | undefined;
  saveCanvas: () => void;
}) => {
  const [fillColor, setFillColor] = useState<string>('#777777');
  const [borderColor, setBorderColor] = useState<string>('#000000');
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [borderStyle, setBorderStyle] = useState<string>('none');
  const [borderWidth, setBorderWidth] = useState<number>(0);

  const activeObject = editor?.canvas.getActiveObject();

  const isShapeSelected = useMemo(() => {
    if (activeObject == null) return false;
    return (
      (activeObject instanceof fabric.Object &&
        activeObject.type !== 'image' &&
        activeObject.type !== 'textbox') ||
      (activeObject instanceof fabric.Group &&
        activeObject.type !== 'image' &&
        activeObject.type !== 'textbox')
    );
  }, [activeObject]);

  const uploadSVG = (e: any) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    if (!file) return;
    fabric.loadSVGFromURL(url, function (objects, options) {
      var svg = fabric.util.groupSVGElements(objects, options);
      svg.set({ left: 100, top: 100 });
      editor?.canvas.add(svg);
      editor?.canvas.renderAll();
    });
  };

  const handleBorderWidthChange = (value: number) => {
    setBorderWidth(value);
    if (activeObject && isShapeSelected) {
      activeObject.set({ strokeWidth: value });
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const handleFillColorChange = (value: string) => {
    setFillColor(value);
    if (isShapeSelected) {
      if (activeObject instanceof fabric.Group && activeObject._objects) {
        activeObject._objects.forEach((path) => {
          path.set({ fill: value });
        });
        editor?.canvas.renderAll();
        saveCanvas();
      } else if (activeObject) {
        activeObject.set({ fill: value });
        editor?.canvas.renderAll();
        saveCanvas();
      }
    }
  };

  const handleBorderColorChange = (value: string) => {
    setBorderColor(value);
    if (isShapeSelected) {
      activeObject?.set({ stroke: value });
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const handleBorderStyleChange = (value: string) => {
    setBorderStyle(value);
    if (isShapeSelected) {
      if (value === 'none') {
        activeObject?.set({ strokeWidth: 0 });
      } else {
        setBorderWidth(1);
        activeObject?.set({
          stroke: borderColor,
          strokeWidth: 1,
        });
      }
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const handleBorderRadiusChange = (value: number) => {
    setBorderRadius(value);
    if (isShapeSelected) {
      // @ts-ignore
      activeObject?.set({ rx: value, ry: value });
      console.log(activeObject);
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  function loadSVG(url: string) {
    fabric.loadSVGFromURL(url, function (objects, options) {
      var svg = fabric.util.groupSVGElements(objects, options);
      svg.scaleToWidth(300);
      svg.set({ left: 100, top: 100, fill: fillColor }); // Setting fill color to red
      editor?.canvas.add(svg);
      editor?.canvas.renderAll();
      saveCanvas();
    });
  }

  const updateShapeFromActiveObject = () => {
    if (activeObject) {
      if (activeObject instanceof fabric.Group && activeObject._objects) {
        const fillColorOb = activeObject._objects[0].fill;
        setFillColor(() => {
          return isHexColor(fillColorOb)
            ? fillColorOb
            : isRgbColor(fillColorOb)
            ? rgbToHex(fillColorOb)
            : '#000000';
        });
      } else {
        setFillColor(() => {
          return isHexColor(activeObject.fill)
            ? activeObject.fill
            : isRgbColor(activeObject.fill)
            ? rgbToHex(activeObject.fill)
            : '#000000';
        });
      }
      if (activeObject.stroke) {
        setBorderStyle('solid');
        setBorderWidth(activeObject.strokeWidth || 0);
        setBorderColor(() => {
          return isHexColor(activeObject.stroke)
            ? activeObject.stroke
            : isRgbColor(activeObject.stroke)
            ? rgbToHex(activeObject.stroke)
            : '#000000';
        });
      } else {
        setBorderStyle('none');
        setBorderWidth(0);
        setBorderColor('#000000');
      }
      if (activeObject.type === 'rectangle') {
        // @ts-ignore
        setBorderRadius(activeObject.rx);
      }
    } else {
      setFillColor('#000000');
      setBorderColor('#000000');
      setBorderWidth(1);
      setBorderStyle('none');
      setBorderRadius(0);
    }
  };

  useEffect(() => {
    updateShapeFromActiveObject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject]);

  const addShape = (shapeType: string) => {
    let shape;
    if (!editor) return;
    switch (shapeType) {
      case 'rectangle':
        editor.addRectangle();
        break;
      case 'circle':
        editor.addCircle();
        break;
      case 'line':
        shape = new fabric.Line([50, 100, 200, 100], {
          top: editor?.canvas.getHeight() / 2,
          left: editor?.canvas.getWidth() / 2,
          stroke: borderColor,
          padding: 10,
        });
        break;
      default:
        return;
    }
    if (shape) {
      editor?.canvas.add(shape);
      editor?.canvas.renderAll();
    }
    saveCanvas();
  };

  return (
    <div>
      <Heading as="h1" size="lg" mb="5">
        Shape
      </Heading>
      {isShapeSelected ? (
        <>
          <Box mb="3">
            <Text>Fill Color</Text>
            <ColorPicker color={fillColor} onChange={handleFillColorChange} />
          </Box>
          <Box mb="3">
            <Text>Border Style</Text>
            <Select
              value={borderStyle}
              onChange={(e) => handleBorderStyleChange(e.target.value)}
            >
              <option value="solid">Solid</option>
              <option value="none">None</option>
            </Select>
          </Box>
          {borderStyle === 'none' ? null : (
            <>
              <Box mb="3">
                <Text>Border Color</Text>
                <ColorPicker
                  color={borderColor}
                  onChange={handleBorderColorChange}
                />
              </Box>
              <Flex gap="1" flexDir="column" mb="3">
                <Text>Border Width</Text>
                <Slider
                  min={0}
                  max={50}
                  value={borderWidth}
                  onChange={handleBorderWidthChange}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
            </>
          )}
          <Box mb="3">
            <Text>Border Radius</Text>
            <Slider
              min={0}
              max={50}
              value={borderRadius}
              onChange={handleBorderRadiusChange}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </>
      ) : (
        <>
          <Heading fontSize={'mg'} mb="3">
            Select a Shape to Add
          </Heading>
          <SecondaryButton
            as="div"
            textAlign={'center'}
            cursor={'pointer'}
            width="full"
            mb="3"
          >
            <label htmlFor="image-upload" style={{ width: '100%' }}>
              Upload SVG
              <input
                type="file"
                id="image-upload"
                accept=".svg"
                style={{ display: 'none' }}
                onChange={uploadSVG}
              />
            </label>
          </SecondaryButton>
          <Box
            display={'grid'}
            gridTemplateColumns={'repeat(auto-fit, minmax(75px, 1fr))'}
            gap="3"
            mt="4"
          >
            {svgList.map((svg, i) => (
              <ShapeItem key={i} onClick={() => loadSVG(`/assets/${svg}`)}>
                <Image width={50} height={50} src={`/assets/${svg}`} alt="" />
              </ShapeItem>
            ))}
            <ShapeItem onClick={() => addShape('rectangle')}>
              <RectangleSVG fill={fillColor} />
            </ShapeItem>
            <ShapeItem onClick={() => addShape('line')}>
              <LineSVG fill={fillColor} />
            </ShapeItem>
            <ShapeItem onClick={() => addShape('circle')}>
              <CircleSVG fill={fillColor} />
            </ShapeItem>
          </Box>
        </>
      )}
    </div>
  );
};

function ShapeItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      display={'grid'}
      placeContent={'center'}
      borderRadius={'md'}
      border="1px"
      borderColor="gray.300"
      _hover={{
        borderColor: 'gray.800',
      }}
      p="2"
      onClick={onClick}
    >
      {children}
    </Box>
  );
}

export default ShapePanel;
