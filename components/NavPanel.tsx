import { state } from '@/utils/editorState';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';
import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { FabricJSEditor } from 'fabricjs-react';
import { IconType } from 'react-icons';
import {
  IoArrowBack,
  IoArrowDown,
  IoArrowForward,
  IoChevronBack,
  IoTrashBin,
} from 'react-icons/io5';
import { useSnapshot } from 'valtio';
import React from 'react';
import { useRouter } from 'next/router';

export default function NavPanel({
  tabIndex,
  setTabIndex,
  tabs,
  editor,
}: {
  tabIndex: number;
  editor: FabricJSEditor | undefined;
  setTabIndex: (index: number) => void;
  tabs: {
    name: string;
    icon: IconType;
    key: string;
    children: ({
      editor,
      saveCanvas,
    }: {
      editor: FabricJSEditor | null | undefined;
      saveCanvas: () => void;
    }) => React.JSX.Element;
  }[];
}) {
  const snap = useSnapshot(state);
  const editorState = snap.editorState;
  const [loading, setLoading] = React.useState(false);

  async function exportPDF() {
    setLoading(true);
    const scaleFactor = 250 / 96; // Reduced DPI from 300 to 150 for smaller file size

    const canvasSize = 512; // 512 x 512
    const pdfSizeInMM = 1080 / 2.83465; // Convert 1080px to mm, assuming 96 DPI

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfSizeInMM, pdfSizeInMM],
    });

    // Iterate over each JSON canvas state in the objects array
    for (let i = 0; i < editorState.length; i++) {
      const json = editorState[i].json;

      // Create a new fabric Canvas instance
      const tempCanvas = new fabric.Canvas(null, {
        width: canvasSize,
        height: canvasSize,
      });

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
      pdf.addImage(
        imageData,
        'PNG',
        0,
        0,
        pdfSizeInMM, // Use pdfSizeInMM instead of pdfWidth
        pdfSizeInMM, // Use pdfSizeInMM instead of pdfHeight
        undefined,
        'FAST'
      );
    }

    // Save the PDF
    pdf.save('download.pdf');
    setLoading(false);
  }

  function downloadPNG() {
    // Generate data URL
    const dataURL = editor?.canvas.toDataURL({
      format: 'png',
      quality: 0.9, // Quality from 0 (low) to 1 (high)
    });
    // Create a link element
    const link = document.createElement('a');
    if (!dataURL) return;
    link.href = dataURL;
    // Set the download attribute to automatically download the image
    // when the link is clicked
    link.download = 'my-canvas.png';
    // Append the link to the body
    document.body.appendChild(link);
    // Programmatically click the link to start the download
    link.click();
    // Remove the link from the body
    document.body.removeChild(link);
  }

  const activeObject = editor?.canvas.getActiveObject();
  const router = useRouter();

  return (
    <Flex
      height={'100%'}
      flexDir={'column'}
      gap="10px"
      py="5"
      px="3"
      className="gray-bg"
    >
      <Tooltip
        label={'Go back'}
        sx={{
          fontFamily: 'system-ui',
        }}
        placement="right"
      >
        <IconButton
          aria-label="Go back"
          icon={<IoChevronBack />}
          bgColor={'transparent'}
          onClick={() => {
            state.editorState = [
              {
                json: null,
                bgColor: '#ffffff',
              },
            ];
            state.activeIndex = 0;
            router.reload();
          }}
          cursor={'pointer'}
        />
      </Tooltip>
      {tabs.map((tab, index) => (
        <Tooltip
          label={`${tab.name} (${tab.key})`}
          key={tab.name}
          placement="right"
          sx={{
            fontFamily: 'system-ui',
          }}
        >
          <Box
            as="button"
            p="3"
            borderRadius={'md'}
            bgColor={tabIndex === index ? 'white' : 'transparent'}
            textColor={'gray.800'}
            boxShadow={tabIndex === index ? 'lg' : 'none'}
            _hover={{
              bgColor: tabIndex === index ? 'white' : 'gray.200',
            }}
            onClick={() => setTabIndex(index)}
            display={'flex'}
            gap="5px"
          >
            <tab.icon aria-describedby="name" />
          </Box>
        </Tooltip>
      ))}
      <Tooltip
        label={'Delete layer'}
        sx={{
          fontFamily: 'system-ui',
        }}
        placement="right"
      >
        <IconButton
          aria-label="Delete layer"
          icon={<IoTrashBin />}
          bgColor={'transparent'}
          onClick={() => {
            editor?.deleteSelected();
          }}
          cursor={activeObject ? 'pointer' : 'not-allowed'}
          opacity={activeObject ? 1 : 0.5}
          disabled={!activeObject}
        />
      </Tooltip>
      <Tooltip
        label={'Send layer to back'}
        sx={{
          fontFamily: 'system-ui',
        }}
        placement="right"
      >
        <IconButton
          aria-label="send to back"
          icon={<IoArrowBack />}
          bgColor={'transparent'}
          onClick={() => {
            activeObject?.sendToBack();
          }}
          cursor={activeObject ? 'pointer' : 'not-allowed'}
          opacity={activeObject ? 1 : 0.5}
          disabled={!activeObject}
        />
      </Tooltip>
      <Tooltip
        label={'Bring layer to front'}
        sx={{
          fontFamily: 'system-ui',
        }}
        placement="right"
      >
        <IconButton
          aria-label="bring forward"
          icon={<IoArrowForward />}
          onClick={() => {
            activeObject?.bringForward();
          }}
          bgColor={'transparent'}
          cursor={activeObject ? 'pointer' : 'not-allowed'}
          opacity={activeObject ? 1 : 0.5}
          disabled={!activeObject}
        />
      </Tooltip>
      <Tooltip
        label={'Download'}
        sx={{
          fontFamily: 'system-ui',
        }}
        placement="right"
      >
        <IconButton
          aria-label="Download"
          p="3"
          borderRadius={'md'}
          bgColor={'#0066ff'}
          textColor={'white'}
          outline={'3px solid rgba(0, 102, 255, 0.2)'}
          boxShadow={'none'}
          isLoading={loading}
          _hover={{
            bgColor: '#005ce6',
          }}
          onClick={async () => {
            await exportPDF();
            // downloadPNG();
            // localStorage.setItem(
            //   'editorState',
            //   JSON.stringify(state.editorState)
            // );
          }}
          icon={<IoArrowDown />}
          display={'flex'}
          gap="5px"
        ></IconButton>
      </Tooltip>
    </Flex>
  );
}
