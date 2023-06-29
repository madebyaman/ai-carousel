import { state } from '@/utils/editorState';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { FabricJSEditor } from 'fabricjs-react';
import { IconType } from 'react-icons';
import { IoArrowDown } from 'react-icons/io5';

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
  return (
    <Flex
      height={'100%'}
      flexDir={'column'}
      gap="10px"
      py="5"
      px="3"
      className="gray-bg"
    >
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
        label={'Download'}
        sx={{
          fontFamily: 'system-ui',
        }}
        placement="right"
      >
        <Box
          as="button"
          p="3"
          borderRadius={'md'}
          bgColor={'#0066ff'}
          textColor={'white'}
          boxShadow={'none'}
          _hover={{
            bgColor: '#005ce6',
          }}
          onClick={() => {
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

            // localStorage.setItem(
            //   'editorState',
            //   JSON.stringify(state.editorState)
            // );
          }}
          display={'flex'}
          gap="5px"
        >
          <IoArrowDown />
        </Box>
      </Tooltip>
      <Tooltip label={'Load'} placement="right">
        <Box
          as="button"
          p="3"
          borderRadius={'md'}
          bgColor={'gray.500'}
          textColor={'white'}
          boxShadow={'none'}
          _hover={{
            bgColor: '#005ce6',
          }}
          onClick={() => {
            const json = localStorage.getItem('editorState');
            if (json) {
              state.editorState = JSON.parse(json);
              state.activeIndex = 0;
            }
          }}
          display={'flex'}
          gap="5px"
        >
          <IoArrowDown />
        </Box>
      </Tooltip>
    </Flex>
  );
}
