import { Box, Flex } from '@chakra-ui/react';
import { proxy, useSnapshot } from 'valtio';
import Editor from './Editor';
import NavPanel from './NavPanel';
import { useFabricJSEditor } from 'fabricjs-react';
import { IoAdd, IoImage, IoScanSharp, IoStar, IoText } from 'react-icons/io5';
import React from 'react';
import ControlPanel from './ControlPanel';
import BackgroundPanel from './BackgroundPanel';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import ShapePanel from './ShapePanel';
import { state } from '@/utils/editorState';

const tabs = [
  {
    name: 'Background',
    icon: IoScanSharp,
    children: BackgroundPanel,
  },
  {
    name: 'Text',
    icon: IoText,
    children: TextPanel,
  },
  {
    name: 'Image',
    icon: IoImage,
    children: ImagePanel,
  },
  {
    name: 'Shape',
    icon: IoStar,
    children: ShapePanel,
  },
];

export default function EditorWrapper() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const currentRender = React.useRef(0);
  const { editor, onReady } = useFabricJSEditor();
  const activeTab = tabs[tabIndex];
  const snap = useSnapshot(state);
  const { activeIndex, editorState } = snap;

  React.useEffect(() => {
    if (editor) {
      const handler = () => saveCanvasState();
      editor.canvas.on('object:modified', handler);
      editor.canvas.on('object:added', handler);
      editor.canvas.on('object:removed', handler);
      editor.canvas.on('selection:created', handler);
      editor.canvas.on('selection:updated', handler);

      return () => {
        // clean up the event handlers when the component is unmounted or the editor changes
        editor.canvas.off({
          'object:modified': handler,
          'object:added': handler,
          'object:removed': handler,
          'selection:created': handler,
          'selection:updated': handler,
        });
      };
    }
  }, [editor]);

  React.useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const json = editorState[activeIndex].json;
      loadJSON(json);
    }

    return () => {
      isMounted = false;
    };
  }, [activeIndex]);

  const loadJSON = (JSON: object | null) => {
    if (editor && editor.canvas) {
      currentRender.current += 1;
      if (!JSON) {
        editor.canvas.clear();
      } else {
        editor.canvas.loadFromJSON(JSON, () => null);
      }
    }
  };

  function saveCanvasState() {
    const json = editor?.canvas.toJSON();
    let newObjects = [];
    if (activeIndex < editorState.length) {
      newObjects = editorState.map((object, index) => {
        return index === activeIndex ? { ...object, json } : object;
      });
    } else {
      newObjects = [
        ...editorState.slice(0, activeIndex),
        { bgColor: '#ffffff', json },
        ...editorState.slice(activeIndex),
      ];
    }
    state.editorState = newObjects;
  }

  return (
    <>
      <NavPanel
        tabs={tabs}
        tabIndex={tabIndex}
        setTabIndex={(num) => setTabIndex(num)}
      />
      <ControlPanel>
        <activeTab.children editor={editor} saveCanvas={saveCanvasState} />
      </ControlPanel>
      <Flex py="5" grow="1" flexDir={'column'} height={'100%'}>
        <Editor editor={editor} onReady={onReady} />
        <Flex flexWrap={'wrap'} mt="4" gap="2" justifyContent={'center'}>
          {editorState.map((object, index) => (
            <Box
              as="button"
              key={index}
              border={'2px'}
              borderColor={activeIndex === index ? 'blue.300' : 'gray.200'}
              display={'grid'}
              placeItems={'center'}
              width="40px"
              height="40px"
              bgColor={'white'}
              onClick={() => {
                state.activeIndex = index;
              }}
            >
              {index + 1}
            </Box>
          ))}
          <Box
            as="button"
            display={'grid'}
            _hover={{
              borderColor: 'gray.400',
            }}
            placeItems={'center'}
            border={'2px'}
            borderColor={'gray.200'}
            bgColor={'white'}
            width="40px"
            height="40px"
            onClick={() => {
              state.activeIndex = editorState.length;
              state.editorState = [
                ...editorState,
                { bgColor: '#ffffff', json: null },
              ];
            }}
          >
            <IoAdd />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
