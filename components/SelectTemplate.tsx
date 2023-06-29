import { Box, Button, Container, Heading } from '@chakra-ui/react';
import Logo from './Logo';
import Link from 'next/link';
import { templates } from './Templates';
import Carousel from './Carousel';
import React from 'react';
import PrimaryButton from './ui/PrimaryButton';
import { state } from '@/utils/editorState';
import template1 from '@/components/templates/template1.json';

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
  const [selectedTemplate, setSelectedTemplate] = React.useState<null | number>(
    null
  );

  function generateText(templates: TemplateItem[]) {
    let textTemplate = '';

    for (let i = 0; i < templates.length; i++) {
      const json = templates[i].json;

      if ('objects' in json && Array.isArray(json.objects)) {
        textTemplate += `Slide ${i + 1}: `;
        const slideContent: string[] = [];

        for (let j = 0; j < json.objects.length; j++) {
          if (json.objects[j].type === 'textbox' && json.objects[j].aiPrompt) {
            slideContent.push(json.objects[j].text);
          }
        }

        textTemplate += slideContent.join(' SlideNext ');
        textTemplate += ' EndSlide, ';
      }
    }

    return textTemplate.slice(0, -2); // Remove the trailing comma and space
  }

  async function generateTemplate(template: string) {
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template,
        prompt: 'get rid of procrastination',
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    setLoading(false);
    return data;
  }

  function parseAIResponse(aiResponse: string) {
    const slides = aiResponse.split('EndSlide').map((s) => s.trim());

    let parsedResult = [];

    for (let slide of slides) {
      // Remove slide prefix (e.g. 'Slide 1:')
      const slideContent = slide.replace(/Slide \d+: /, '');
      const elements = slideContent.split('SlideNext').map((s) => s.trim());
      parsedResult.push(elements);
    }

    return parsedResult;
  }

  return (
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
        <Heading textAlign={'center'} as="h1" size="xl">
          Pick a template to get started
        </Heading>
        <Box
          as="section"
          py={10}
          display={'flex'}
          gap="5"
          flexWrap={'wrap'}
          justifyContent={'center'}
        >
          {templates.map((template, i) => (
            <Carousel
              key={i}
              images={template.slides}
              onClick={() => setSelectedTemplate(i)}
              borderColor={i === selectedTemplate ? 'blue.500' : 'gray.200'}
              // json={template.json}
            />
          ))}
          <PrimaryButton
            disabled={selectedTemplate === null}
            opacity={selectedTemplate === null ? '0.5' : '1'}
            pointerEvents={selectedTemplate === null ? 'none' : 'auto'}
            onClick={async () => {
              if (selectedTemplate === null) return;
              const text = generateText(
                templates[selectedTemplate].json as any
              );
              const aiResult = await generateTemplate(text);
              const result = aiResult.choices[0].message.content;
              const parsedResult = parseAIResponse(result);
              console.log(parsedResult);
            }}
          >
            Start Designing
          </PrimaryButton>
        </Box>
      </Container>
    </Box>
  );
}
