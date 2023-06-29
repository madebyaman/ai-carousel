import { useEffect, useState } from 'react';
import SecondaryButton from './ui/PrimaryButton';
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
import { fabric } from 'fabric';
import DeleteButton from './ui/DeleteButton';
import TertiaryButton from './ui/TertiaryButton';
import { FabricJSEditor } from 'fabricjs-react';

const ImagePanel = ({
  editor,
  saveCanvas,
}: {
  editor: FabricJSEditor | null | undefined;
  saveCanvas: () => void;
}) => {
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(0);
  const [imageFilters, setImageFilters] = useState<string>('none');

  const handleBorderWidthChange = (value: number) => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ strokeWidth: value });
      editor?.canvas.renderAll();
      saveCanvas();
      setBorderWidth(value);
    }
  };
  const url = '/templates/time.png';

  const uploadImage = (e: any) => {
    // const file = e.target.files[0];
    // const url = URL.createObjectURL(file);
    // if (!file) return;

    // const file = e.target.files[0];
    // if (file) {
    // const url = URL.createObjectURL(file);
    fabric.Image.fromURL(url, function (img) {
      const maxWidth = 500; // Set this to the maximum width you want
      if (img.width && img.width > maxWidth) {
        img.scaleToWidth(maxWidth);
      }
      editor?.canvas.add(img);
      saveCanvas();
    });
    // });
    // }
  };

  const handleBorderColorChange = (value: string) => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ stroke: value });
      editor?.canvas.renderAll();
      saveCanvas();
      setBorderColor(value);
    }
  };

  const onChangeImageFilters = (filterType: string) => {
    const activeObject = editor?.canvas.getActiveObject();
    const filters = [];

    switch (filterType) {
      case 'low-contrast':
        filters.push(new fabric.Image.filters.Brightness({ brightness: -0.1 }));
        break;
      case 'high-contrast':
        filters.push(new fabric.Image.filters.Brightness({ brightness: -0.3 }));
        break;
      case 'light-blur':
        filters.push(new fabric.Image.filters.Blur({ blur: 0.1 }));
        break;
      case 'heavy-blur':
        filters.push(new fabric.Image.filters.Blur({ blur: 0.3 }));
        break;
      case 'grayscale':
        filters.push(
          new fabric.Image.filters.Grayscale({
            grayscale: 1,
          })
        );
        break;
      default:
    }
    activeObject.filters = filters;
    activeObject.applyFilters();

    editor?.canvas.renderAll();
    saveCanvas();
    setImageFilters(filterType);
  };

  const updateFiltersFromImage = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (
      activeObject &&
      activeObject instanceof fabric.Image &&
      Array.isArray(activeObject.filters) &&
      activeObject.filters.length > 0
    ) {
      const currentFilter = activeObject.filters[0].type;
      let filterType = 'none';

      switch (currentFilter) {
        case 'Brightness':
          filterType =
            activeObject.filters[0].brightness > -0.2
              ? 'low-contrast'
              : 'high-contrast';
          break;
        case 'Blur':
          filterType =
            activeObject.filters[0].blur <= 0.2 ? 'light-blur' : 'heavy-blur';
          break;
        case 'Grayscale':
          filterType = 'grayscale';
          break;
        default:
          filterType = 'none';
      }

      setImageFilters(filterType);
    } else {
      setImageFilters('none');
    }
  };

  const updateBorderWidthFromImage = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject instanceof fabric.Image && activeObject.strokeWidth) {
      setBorderWidth(activeObject.strokeWidth);
    } else {
      setBorderWidth(0);
    }
  };

  const updateBorderColorFromImage = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject instanceof fabric.Image && activeObject.stroke) {
      setBorderColor(activeObject.stroke);
    } else {
      setBorderColor('#ffffff');
    }
  };

  useEffect(() => {
    const handleObjectSelected = () => {
      updateFiltersFromImage();
      updateBorderColorFromImage();
      updateBorderWidthFromImage();
    };

    editor?.canvas.on('selection:created', handleObjectSelected);
    editor?.canvas.on('selection:updated', handleObjectSelected);

    // Cleanup function
    return () => {
      editor?.canvas.off('selection:created', handleObjectSelected);
      editor?.canvas.off('selection:updated', handleObjectSelected);
    };
  }, [editor?.canvas]); // The effect depends on editor.canvas

  const isImageSelected =
    editor?.canvas.getActiveObject() instanceof fabric.Image;

  return (
    <div>
      <Heading as="h1" size="lg" mb="5">
        Image
      </Heading>
      {isImageSelected ? (
        <>
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
          <Box mb="3">
            <Text>Border Color</Text>
            <ColorPicker
              color={borderColor}
              onChange={handleBorderColorChange}
            />
          </Box>
          <Box mb="3">
            <Select
              value={imageFilters}
              onChange={(e) => onChangeImageFilters(e.target.value)}
            >
              <option value="none">None</option>
              <option value="low-contrast">Low Contrast</option>
              <option value="high-contrast">High Contrast</option>
              <option value="light-blur">Light Blur</option>
              <option value="heavy-blur">Heavy Blur</option>
              <option value="grayscale">Grayscale</option>
            </Select>
          </Box>
          <TertiaryButton
            onClick={() => {
              const activeObject = editor?.canvas.getActiveObject();
              if (activeObject) {
                activeObject.bringToFront();
                editor?.canvas.renderAll();
              }
            }}
          >
            Bring to Front
          </TertiaryButton>
          <TertiaryButton
            onClick={() => {
              const activeObject = editor?.canvas.getActiveObject();
              if (activeObject) {
                activeObject.sendToBack();
                editor?.canvas.renderAll();
              }
            }}
          >
            Send to Back
          </TertiaryButton>
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
        <SecondaryButton
          as="div"
          textAlign={'center'}
          cursor={'pointer'}
          width="full"
          mb="3"
        >
          <label htmlFor="image-upload" style={{ width: '100%' }}>
            Upload Image
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={uploadImage}
            />
          </label>
        </SecondaryButton>
      )}
    </div>
  );
};

export default ImagePanel;
