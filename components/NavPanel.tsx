import { state } from '@/utils/editorState';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { FabricJSEditor } from 'fabricjs-react';
import { IconType } from 'react-icons';
import {
  IoArrowDown,
  IoImage,
  IoScanSharp,
  IoStar,
  IoText,
} from 'react-icons/io5';
import { useSnapshot } from 'valtio';

export default function NavPanel({
  tabIndex,
  setTabIndex,
  tabs,
}: {
  tabIndex: number;
  setTabIndex: (index: number) => void;
  tabs: {
    name: string;
    icon: IconType;
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
  return (
    <Flex
      borderRadius={'md'}
      height={'100%'}
      flexDir={'column'}
      gap="10px"
      py="5"
      px="3"
      backgroundColor={'gray.100'}
    >
      {tabs.map((tab, index) => (
        <Tooltip label={tab.name} key={tab.name} placement="right">
          <Box
            as="button"
            p="3"
            borderRadius={'md'}
            bgColor={tabIndex === index ? 'white' : 'gray.100'}
            boxShadow={tabIndex === index ? 'lg' : 'none'}
            _hover={{
              bgColor: 'white',
            }}
            onClick={() => setTabIndex(index)}
            display={'flex'}
            gap="5px"
          >
            <tab.icon aria-describedby="name" />
          </Box>
        </Tooltip>
      ))}
      <Tooltip label={'Download'} placement="right">
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
            localStorage.setItem(
              'editorState',
              JSON.stringify(state.editorState)
            );
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
