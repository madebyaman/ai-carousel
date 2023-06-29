import EditorWrapper from '@/components/EditorWrapper';
import SelectTemplate from '@/components/SelectTemplate';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

export default function Editor() {
  const [template, setTemplate] = React.useState<string>('');

  return (
    <>
      <Head>
        <title>Slidelink Editor</title>
      </Head>
      <Box>
        {template ? (
          <EditorWrapper template={template} />
        ) : (
          <SelectTemplate setTemplate={setTemplate} />
        )}
      </Box>
    </>
  );
}
