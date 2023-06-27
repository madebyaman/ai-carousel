import { useState, useEffect } from 'react';
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
import DeleteButton from './ui/DeleteButton';

const ShapePanel = ({ editor, saveCanvas }) => {
  const [shapeType, setShapeType] = useState<string>('');
  const [fillColor, setFillColor] = useState<string>('#000000');
  const [borderColor, setBorderColor] = useState<string>('#000000');
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [borderStyle, setBorderStyle] = useState<string>('none');
  const [borderWidth, setBorderWidth] = useState<number>(1);

  const isShapeSelected = () =>
    editor?.canvas.getActiveObject() instanceof fabric.Object &&
    editor?.canvas.getActiveObject().type !== 'image';

  const handleBorderWidthChange = (value: number) => {
    setBorderWidth(value);
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject && isShapeSelected()) {
      activeObject.set({ strokeWidth: value });
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const handleFillColorChange = (value: string) => {
    setFillColor(value);
    if (isShapeSelected()) {
      const activeObject = editor?.canvas.getActiveObject();
      activeObject.set({ fill: value });
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const handleBorderColorChange = (value: string) => {
    setBorderColor(value);
    if (isShapeSelected()) {
      const activeObject = editor?.canvas.getActiveObject();
      activeObject.set({ stroke: value });
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const handleBorderStyleChange = (value: string) => {
    setBorderStyle(value);
    if (isShapeSelected()) {
      const activeObject = editor?.canvas.getActiveObject();
      if (value === 'none') {
        activeObject.set({ strokeWidth: 0 });
      } else {
        setBorderWidth(1);
        activeObject.set({
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
    if (isShapeSelected()) {
      const activeObject = editor?.canvas.getActiveObject();
      activeObject.set({ rx: value, ry: value });
      console.log(activeObject);
      editor?.canvas.renderAll();
      saveCanvas();
    }
  };

  const updateShapeFromActiveObject = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      setShapeType(activeObject.type);
      setFillColor(activeObject.fill);
      setBorderColor(activeObject.stroke);
      setBorderWidth(activeObject.strokeWidth);
      setBorderStyle(activeObject.strokeWidth > 0 ? 'solid' : 'none');
      if (activeObject.type === 'rectangle') {
        setBorderRadius(activeObject.rx);
      }
    } else {
      setShapeType('');
      setFillColor('#000000');
      setBorderColor('#000000');
      setBorderWidth(1);
      setBorderStyle('none');
      setBorderRadius(0);
    }
  };

  useEffect(() => {
    updateShapeFromActiveObject();
  }, [editor?.canvas.getActiveObject()]);

  const addShape = (shapeType: string) => {
    let shape;
    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          top: editor?.canvas.getHeight() / 2,
          left: editor?.canvas.getWidth() / 2,
          width: 100,
          height: 100,
          fill: fillColor,
          stroke: borderColor,
          rx: borderRadius,
          ry: borderRadius,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          top: editor?.canvas.getHeight() / 2,
          left: editor?.canvas.getWidth() / 2,
          radius: 50,
          fill: fillColor,
          stroke: borderColor,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          top: editor?.canvas.getHeight() / 2,
          left: editor?.canvas.getWidth() / 2,
          width: 100,
          height: 100,
          fill: fillColor,
          stroke: borderColor,
        });
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
    setShapeType(shapeType);
    editor?.canvas.add(shape);
    editor?.canvas.renderAll();
    saveCanvas();
  };

  return (
    <div>
      <Heading as="h1" size="lg" mb="5">
        Shape
      </Heading>
      {isShapeSelected() ? (
        <>
          {shapeType !== 'line' && (
            <Box mb="3">
              <Text>Fill Color</Text>
              <ColorPicker color={fillColor} onChange={handleFillColorChange} />
            </Box>
          )}
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
          {borderStyle !== 'none' && (
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
          {shapeType === 'rectangle' && (
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
          )}
          <DeleteButton
            onClick={() => {
              const activeObject = editor?.canvas.getActiveObject();
              if (activeObject) {
                editor?.canvas.remove(activeObject);
                editor?.canvas.renderAll();
                saveCanvas();
              }
            }}
          >
            Delete
          </DeleteButton>
        </>
      ) : (
        <>
          <Text>Select a Shape to Add</Text>
          <Select value={shapeType} onChange={(e) => addShape(e.target.value)}>
            <option value="">Shape</option>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
            <option value="line">Line</option>
          </Select>
        </>
      )}
    </div>
  );
};

export default ShapePanel;
