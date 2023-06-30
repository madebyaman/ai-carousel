import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  Box,
  Checkbox,
  Text,
  Container,
  Heading,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import Logo from './Logo';
import Link from 'next/link';
import { templates } from './Templates';
import Carousel from './Carousel';
import React from 'react';
import PrimaryButton from './ui/PrimaryButton';
import { state } from '@/utils/editorState';
import { IoAdd } from 'react-icons/io5';
import fabric from 'fabric';

interface TemplateObject {
  type: string;
  text: string;
  aiPrompt?: string;
}

interface TemplateItem {
  json: {
    objects: TemplateObject[];
  };
}

export default function SelectTemplate({
  setTemplate,
}: {
  setTemplate: (template: string) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [ai, setAI] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    null | number
  >();
  const buttonRef = React.useRef<null | HTMLButtonElement>(null);

  function scrollToButton() {
    if (buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  async function handleGenerate() {
    if (selectedTemplate === undefined) return;
    if (selectedTemplate === null) {
      setTemplate('2'); // pass any number to trigger editor
      return;
    }
    setLoading(true);
    if (ai) {
      const aiResult = await generateAIContent();
      const result = aiResult.choices[0].message.content;
      console.log(result);
      const parsedResult = parseAIResponse(result);
      console.log(parsedResult);
      replaceTemplateText(
        templates[selectedTemplate].json as any,
        parsedResult
      );
    }
    setLoading(false);
    state.editorState = templates[selectedTemplate].json;
    setTemplate('2');
  }

  function replaceTemplateText(template: TemplateItem[], result: string[][]) {
    let currentSlideIndex = 0;
    let currentObjectIndex = 0;

    for (let i = 0; i < template.length; i++) {
      const obj = template[i].json;
      for (let j = 0; j < obj.objects.length; j++) {
        const object = obj.objects[j];
        if (object.type === 'textbox' && object.aiPrompt) {
          if (currentObjectIndex < result[currentSlideIndex].length) {
            object.text = result[currentSlideIndex][currentObjectIndex];
          }

          currentObjectIndex++;
          if (currentObjectIndex >= result[currentSlideIndex].length) {
            currentSlideIndex++;
            currentObjectIndex = 0;
          }
        }
      }
    }
  }

  function generateTemplateArrays(template: TemplateItem[]) {
    const arrays: string[][] = [];
    for (let i = 0; i < template.length; i++) {
      let currentSlide: string[] = [];
      const obj = template[i].json;
      for (let j = 0; j < obj.objects.length; j++) {
        const object = template[i].json.objects[j];
        if (object.type === 'textbox' && object.aiPrompt) {
          currentSlide.push(object.text);
        } else {
        }
      }
      arrays.push(currentSlide);
    }
    return arrays;
  }

  function generateTextTemplate(templateArrays: string[][]) {
    let textTemplate = '';

    for (let i = 0; i < templateArrays.length; i++) {
      textTemplate += `Slide ${i + 1}: `;
      textTemplate += templateArrays[i].join(' SlideNext ');
      textTemplate += ' EndSlide, ';
    }

    return textTemplate.slice(0, -2); // Remove the trailing comma and space
  }

  async function generateAIContent() {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  }

  function parseAIResponse(aiResponse: string) {
    const slides = aiResponse
      .split(/EndSlide\n?/)
      .filter((s) => s.trim().length > 0);

    let parsedResult = [];

    for (let slide of slides) {
      // Remove slide prefix (e.g. 'Slide \d+: ')
      const slideContent = slide.replace(/Slide \d+: /g, '').trim();
      const elements = slideContent.split('SlideNext').map((s) => s.trim());
      // Remove any empty elements due to trailing 'SlideNext'
      const nonEmptyElements = elements.filter((s) => s !== '');
      if (nonEmptyElements.length > 0) {
        parsedResult.push(nonEmptyElements);
      }
    }

    return parsedResult;
  }

  return (
    <MotionConfig
      transition={{ duration: 0.2, type: 'ease', ease: 'easeInOut' }}
    >
      <Box w="full">
        <Container maxWidth={'6xl'}>
          <Box
            as="header"
            py={5}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Link href="/">
              <Logo
                style={{
                  width: '150px',
                }}
              />
            </Link>
          </Box>
        </Container>
        <Container mt="12" maxWidth={'6xl'}>
          <Heading as="h1" size="xl">
            Pick a template to get started
          </Heading>
          <Box
            as="section"
            mt="5"
            mb="7"
            display={'flex'}
            gap="5"
            flexWrap={'wrap'}
            justifyContent={'flex-start'}
          >
            {templates.map((template, i) => (
              <Carousel
                key={i}
                images={template.slides}
                onClick={() => {
                  scrollToButton();
                  setSelectedTemplate(i);
                }}
                borderColor={i === selectedTemplate ? 'blue.500' : 'gray.200'}
              />
            ))}
            <Box
              cursor={'pointer'}
              onClick={() => {
                scrollToButton();
                setSelectedTemplate(null);
              }}
              borderRadius={'md'}
              border="1px solid"
              borderColor={selectedTemplate === null ? 'blue.500' : 'gray.200'}
              bgColor={'transparent'}
              alignItems={'center'}
              p="3"
            >
              <Box
                display={'flex'}
                w="300px"
                h="300px"
                alignItems={'center'}
                justifyContent={'center'}
                flexDirection={'column'}
                gap="3"
              >
                <IoAdd size="60" color="gray.400" />
                <Text fontSize={'md'} textColor="gray.700">
                  Start with blank canvas
                </Text>
              </Box>
            </Box>
          </Box>
          <Box
            textAlign={'center'}
            mb="10"
            display={'flex'}
            flexDirection={'column'}
            alignItems={'start'}
          >
            <Checkbox
              checked={ai}
              onChange={(e) => setAI(e.target.checked)}
              display={'flex'}
              alignItems={'center'}
              disabled={selectedTemplate === null}
              gap="1"
              mb="3"
            >
              <Box
                as="span"
                display="inline-flex"
                gap="1px"
                alignItems={'center'}
              >
                <svg
                  viewBox="0 0 14 17"
                  // fill="currentColor"
                  fill={'rgb(149, 64, 212)'}
                  style={{
                    width: '16px',
                    height: '16px',
                    display: 'block',
                    flexShrink: '0',
                    backfaceVisibility: 'hidden',
                    marginRight: '4px',
                  }}
                >
                  <path d="M6.417 4.074c.096 0 .157-.061.178-.157.191-1.114.184-1.128 1.36-1.36.096-.02.157-.076.157-.178 0-.096-.061-.157-.157-.171-1.176-.219-1.155-.24-1.36-1.36-.02-.096-.082-.164-.178-.164-.096 0-.157.068-.178.164-.205 1.107-.177 1.12-1.36 1.36-.096.014-.157.075-.157.17 0 .103.061.158.164.179 1.169.225 1.162.232 1.353 1.36.02.096.082.157.178.157zM3.095 8.921c.15 0 .266-.11.287-.253.232-1.798.28-1.812 2.167-2.16a.276.276 0 00.246-.28c0-.15-.11-.267-.253-.28-1.873-.26-1.928-.315-2.16-2.154-.02-.15-.13-.26-.287-.26-.15 0-.26.11-.28.267-.22 1.798-.294 1.798-2.168 2.146-.15.02-.252.13-.252.28 0 .158.102.26.28.28 1.846.288 1.92.35 2.14 2.147.02.158.13.267.28.267zm4.82 7.54c.211 0 .375-.15.41-.376.498-3.67 1.01-4.252 4.655-4.662a.416.416 0 00.39-.41c0-.22-.165-.383-.39-.417-3.61-.431-4.123-.957-4.656-4.662-.04-.22-.198-.37-.41-.37-.212 0-.376.15-.41.37-.5 3.677-1.012 4.258-4.655 4.662-.226.027-.39.198-.39.417 0 .212.164.383.39.41 3.602.492 4.101.964 4.655 4.662.04.226.198.376.41.376z"></path>
                </svg>
                Use AI to generate content
              </Box>
            </Checkbox>
            <motion.div
              animate={{ height: ai ? 'auto' : '0' }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                margin: '0',
              }}
            >
              <AnimatePresence mode="wait">
                {ai && (
                  <Textarea
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="form"
                    as={motion.textarea}
                    exit={{ opacity: 0 }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxW="2xl"
                    mb="3"
                    placeholder="Awesome! which topic or title would you like to generate content for?"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <Alert
              status="info"
              maxW="2xl"
              display={'flex'}
              alignItems={'flex-start'}
              justifyContent={'flex-start'}
              rounded="md"
              colorScheme="gray"
              mb="5"
            >
              <AlertIcon />
              <AlertDescription textAlign={'left'} fontSize={'sm'}>
                If using AI, please manually check content for correctness as
                well design after the generated content is added.
              </AlertDescription>
            </Alert>
            <PrimaryButton
              isLoading={loading}
              disabled={selectedTemplate === undefined || loading}
              opacity={selectedTemplate === undefined ? '0.5' : '1'}
              pointerEvents={selectedTemplate === undefined ? 'none' : 'auto'}
              onClick={async () => {
                handleGenerate();
              }}
            >
              Start Designing
            </PrimaryButton>
          </Box>
        </Container>
      </Box>
    </MotionConfig>
  );
}
