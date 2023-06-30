import { Box } from '@chakra-ui/react';
import template1 from './templates/template1.json';
import template4 from './templates/template4.json';
import template2 from './templates/template2.json';
import template3 from './templates/template3.json';
import Carousel from './Carousel';

export const templates = [
  {
    slides: [
      '/template-img/3/1.png',
      '/template-img/3/2.png',
      '/template-img/3/3.png',
      '/template-img/3/4.png',
      '/template-img/3/5.png',
    ],
    json: template3,
  },
  {
    slides: [
      '/template-img/1/1.png',
      '/template-img/1/2.png',
      '/template-img/1/3.png',
      '/template-img/1/4.png',
    ],
    json: template1,
  },
  {
    slides: [
      '/template-img/4/1.png',
      '/template-img/4/2.png',
      '/template-img/4/3.png',
      '/template-img/4/4.png',
    ],
    json: template4,
  },
  {
    slides: [
      '/template-img/2/1.png',
      '/template-img/2/2.png',
      '/template-img/2/3.png',
      '/template-img/2/4.png',
      '/template-img/2/5.png',
    ],
    json: template2,
  },
];

export default function Templates() {
  return (
    <Box
      as="section"
      py={10}
      display={'flex'}
      gap="5"
      flexWrap={'wrap'}
      justifyContent={'center'}
    >
      {templates.map((template, i) => (
        <Carousel key={i} images={template.slides} />
      ))}
    </Box>
  );
}
