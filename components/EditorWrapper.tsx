import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { useSnapshot } from 'valtio';
import Editor from './Editor';
import NavPanel from './NavPanel';
import { useFabricJSEditor } from 'fabricjs-react';
import FontFaceObserver from 'fontfaceobserver';
import { fabric } from 'fabric';
import {
  IoAdd,
  IoCopy,
  IoImage,
  IoScanSharp,
  IoStar,
  IoText,
  IoTrashBin,
} from 'react-icons/io5';
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
    key: 'b',
  },
  {
    name: 'Text',
    icon: IoText,
    children: TextPanel,
    key: 't',
  },
  {
    name: 'Image',
    icon: IoImage,
    children: ImagePanel,
    key: 'i',
  },
  {
    name: 'Shape',
    icon: IoStar,
    children: ShapePanel,
    key: 's',
  },
];

export default function EditorWrapper({ template }: { template: string }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [editorReady, setEditorReady] = React.useState(false);
  const { editor, onReady } = useFabricJSEditor();
  const activeTab = tabs[tabIndex];
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const snap = useSnapshot(state);
  const { activeIndex, editorState } = snap;

  React.useEffect(() => {
    if (editor && editor.canvas && !editorReady) {
      setEditorReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  React.useEffect(() => {
    const handleContainerClick = (e: any) => {
      if (e.target instanceof HTMLCanvasElement) return;
      editor?.canvas.discardActiveObject().renderAll();
    };

    const containerElement = canvasContainerRef.current;
    containerElement?.addEventListener('click', handleContainerClick);

    // Remove event listener on component unmount
    return () => {
      containerElement?.removeEventListener('click', handleContainerClick);
    };
  }, [editor]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const elements = ['INPUT', 'TEXTAREA'];
      if (elements.includes((event.target as HTMLElement).tagName)) {
        return;
      }
      const activeObject = editor?.canvas.getActiveObject();
      if (
        activeObject &&
        activeObject.type === 'textbox' &&
        (activeObject as fabric.Textbox)?.isEditing
      ) {
        return;
      }
      switch (event.key) {
        case 'b':
          setTabIndex(0);
          break;
        case 't':
          setTabIndex(1);
          break;
        case 'i':
          setTabIndex(2);
          break;
        case 's':
          setTabIndex(3);
          break;
        case 'Backspace':
          editor?.deleteSelected();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  React.useEffect(() => {
    if (editor) {
      const handler = (e: fabric.IEvent<MouseEvent>) => {
        const activeObject = editor?.canvas.getActiveObject();
        if (activeObject instanceof fabric.Image) {
          setTabIndex(2);
        } else if (activeObject instanceof fabric.Text) {
          setTabIndex(1);
        } else if (activeObject instanceof fabric.Object) {
          setTabIndex(3);
        }
        saveCanvasState();
      };

      const mouseOverHandler = (e: fabric.IEvent<MouseEvent>) => {
        if (!e.target) return;
        //@ts-ignore
        e.target.set('originalFill', e.target.fill);
        e.target.set('fill', 'red');
        editor?.canvas.renderAll();
      };
      const mouseOutHandler = (e: fabric.IEvent<MouseEvent>) => {
        //@ts-ignore
        if (e.target && e.target.originalFill) {
          //@ts-ignore
          e.target.set('fill', e.target.originalFill);
          editor.canvas.renderAll();
        }
      };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  React.useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const json = editorState[activeIndex]?.json;
      loadJSON(json);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, editorReady]);

  const loadJSON = async (JSON: object | null) => {
    if (editor && editor.canvas) {
      if (JSON) {
        // Extract all unique font families from the JSON
        if ('objects' in JSON && Array.isArray(JSON.objects)) {
          try {
            const fontFamilies = [
              ...new Set(
                JSON.objects?.map((obj) => obj.fontFamily).filter(Boolean)
              ),
            ];
            await Promise.all(
              fontFamilies.map(async (font) => {
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
                await observer.load();
              })
            );
          } catch (error) {
            console.error('Failed to load fonts:', error);
          }
        }
        editor.canvas.loadFromJSON(JSON, function () {
          editor.canvas.getObjects().forEach((obj) => {
            if (obj.type === 'line') {
              obj.set({ padding: 10 });
              console.log(obj);
            }
          });
          editor.canvas.renderAll();
        });
      } else {
        editor.canvas.clear();
        editor.canvas.renderAll();
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
    <Box w="100vw" h="100vh" display={'flex'} flexDirection={'row'}>
      <NavPanel
        editor={editor}
        tabs={tabs}
        tabIndex={tabIndex}
        setTabIndex={(num) => setTabIndex(num)}
      />
      <ControlPanel>
        <activeTab.children editor={editor} saveCanvas={saveCanvasState} />
      </ControlPanel>
      <Flex
        py="5"
        grow="1"
        height={'100%'}
        justifyContent={'center'}
        ref={canvasContainerRef}
        overflowY="scroll"
        bgImage={`url('/assets/bubbles.svg')`}
        bgRepeat="repeat"
        bgSize="50px 50px"
        bgBlendMode="multiply"
      >
        <Flex flexDir={'column'}>
          <Flex display={'inline-flex'} justifyContent={'flex-end'}>
            <Tooltip label="Delete slide" aria-label="Delete">
              <IconButton
                bgColor={'transparent'}
                icon={<IoTrashBin />}
                aria-label="Delete"
                onClick={() => {
                  if (editorState.length <= 1) {
                    // set json to null
                    return;
                  }
                  state.editorState = editorState.filter(
                    (_, index) => index !== activeIndex
                  );
                  state.activeIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;
                }}
                _hover={{
                  bgColor: 'gray.100',
                }}
              />
            </Tooltip>
            <Tooltip label="Copy slide" aria-label="Copy">
              <IconButton
                bgColor={'transparent'}
                icon={<IoCopy />}
                aria-label="Copy"
                onClick={() => {
                  state.editorState = [
                    ...editorState.slice(0, activeIndex + 1),
                    editorState[activeIndex],
                    ...editorState.slice(activeIndex + 1),
                  ];
                  state.activeIndex = activeIndex + 1;
                }}
                _hover={{
                  bgColor: 'gray.100',
                }}
              />
            </Tooltip>
          </Flex>
          <Editor editor={editor} onReady={onReady} />
          <Flex flexWrap={'wrap'} mt="4" gap="2" justifyContent={'center'}>
            {editorState.map((object, index) => (
              <Box
                as="button"
                key={index}
                border={'2px'}
                borderColor={
                  activeIndex === index ? 'rgb(0, 102, 255, 0.7)' : 'gray.200'
                }
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
      </Flex>
    </Box>
  );
}
