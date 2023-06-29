import { Box, Button, Container, Heading } from '@chakra-ui/react';
import Logo from './Logo';
import Link from 'next/link';
import { templates } from './Templates';
import Carousel from './Carousel';
import React from 'react';
import PrimaryButton from './ui/PrimaryButton';
import { state } from '@/utils/editorState';

export default function SelectTemplate({
  setTemplate,
}: {
  setTemplate: (template: string) => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<null | number>(
    null
  );

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
            onClick={() => {
              if (selectedTemplate === null) return;
              const json = templates[selectedTemplate].json;
              state.editorState = json;
              setTemplate(selectedTemplate.toString());
            }}
          >
            Start Designing
          </PrimaryButton>
        </Box>
      </Container>
    </Box>
  );
}
