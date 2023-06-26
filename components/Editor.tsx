import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import { fabric } from 'fabric';

import {
  FabricJSCanvas,
  FabricJSEditor,
  useFabricJSEditor,
} from 'fabricjs-react';
import { IoAdd } from 'react-icons/io5';
import CanvasBackground from './BackgroundPanel';
import { Canvas } from 'fabric/fabric-impl';

const Editor = ({
  editor,
  onReady,
}: {
  editor: FabricJSEditor | undefined;
  onReady: (canvas: Canvas) => void;
}) => {
  const onAddCircle = () => {
    editor?.addCircle();
  };

  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  const onAddImage = () => {
    fabric.Image.fromURL('https://via.placeholder.com/150', function (oImg) {
      oImg.scale(0.5);
      editor?.canvas.add(oImg);
    });
  };

  async function exportPDF() {
    const scaleFactor = 300 / 96; // Increase DPI from 96 (default) to 300
    const sizeInMm = 1024 * 0.264583;

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [sizeInMm, sizeInMm],
    });

    // Iterate over each JSON canvas state in the objects array
    for (let i = 0; i < objects.length; i++) {
      const json = objects[i];

      // Create a new fabric Canvas instance
      const tempCanvas = new fabric.Canvas(null);

      // Await for the JSON data to be loaded into the canvas
      await new Promise((resolve) => {
        tempCanvas.loadFromJSON(json, resolve);
      });

      // Create a data URL of the canvas content, but with increased resolution
      const imageData = tempCanvas.toDataURL({
        format: 'png',
        multiplier: scaleFactor,
      });

      // Add a new page if this isn't the first canvas
      if (i > 0) {
        pdf.addPage();
      }

      // Add the image to the PDF
      const imgProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    // Save the PDF
    pdf.save('download.pdf');
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      fabric.Image.fromURL(url, function (oImg) {
        oImg.scale(0.5);
        editor?.canvas.add(oImg);
      });
    }
  };

  // React.useEffect(() => {
  //   const handleClickOutsideCanvas = (event: any) => {
  //     if (editor && editor.canvas && !editor.canvas.contains(event.target)) {
  //       editor.canvas.discardActiveObject().renderAll();
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutsideCanvas);

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutsideCanvas);
  //   };
  // }, [editor]);

  return (
    <Box display={'flex'} flexDirection={'column'}>
      {/* <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddText}>Add Text</button>
      <button onClick={bringToFront}>Bring to Front</button>
      <button onClick={sendToBack}>Send to Back</button>
      <input type="file" onChange={handleImageUpload} />
      {/* <button onClick={onAddImage}>Add Image</button> */}
      {/* <button onClick={exportPDF}>Export</button>  */}
      <Box
        as={FabricJSCanvas}
        width={'512px'}
        height={'512px'}
        placeSelf={'center'}
        className="sample-canvas"
        backgroundColor={'white'}
        boxShadow={'md'}
        borderRadius={'md'}
        p="1"
        onReady={onReady}
      />
    </Box>
  );
};

export default Editor;
