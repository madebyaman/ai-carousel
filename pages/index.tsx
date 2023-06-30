import Carousel from '@/components/Carousel';
import Logo from '@/components/Logo';
import Templates from '@/components/Templates';
import BackgroundSVG from '@/components/bg-svg';
import { state } from '@/utils/editorState';
import {
  Box,
  Button,
  Container,
  chakra,
  Heading,
  Text,
  shouldForwardProp,
  Image,
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import Head from 'next/head';
import NextImage from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ChakraContent = chakra(motion.p, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const steps = [
  {
    title: 'Pick a template',
    description:
      'Choose from a variety of templates to get started. You can pick a template and <strong>then use AI to populate content</strong> based on any topic.',
  },
  {
    title: 'Customize your slides',
    description:
      'Our powerful editor allows you to customize your slides with a variety of shapes, images, and text. Plus, it has <strong>keyboard shortcuts for power users.</strong>',
  },
  {
    title: 'Download your carousel',
    description:
      'Once you are done customizing your carousel, you can <strong>download it as a PDF file</strong>. Then, you can also share it in LinkedIn.',
  },
];

export default function Home() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  useEffect(() => {
    state.editorState = [
      {
        json: null,
        bgColor: '#ffffff',
      },
    ];
    state.activeIndex = 0;
  }, []);

  return (
    <>
      <Head>
        <title>Slidelink</title>
      </Head>
      <Box
        as="section"
        bgImage={`url('/assets/hideout.svg')`}
        bgRepeat="repeat"
        bgSize="50px 50px"
        bgBlendMode="multiply"
      >
        <Container maxWidth={'6xl'}>
          <Box
            as="header"
            py={5}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Logo
              style={{
                width: '150px',
              }}
            />
            <Button
              as={Link}
              href="/editor"
              px={6}
              py={3}
              bgColor={'rgba(0, 102, 255, 0.1)'}
              color={'rgba(0, 102, 255, 1)'}
              _hover={{
                bgColor: 'rgba(0, 102, 255, 0.2)',
              }}
            >
              Create a carousel
            </Button>
          </Box>
        </Container>
        <Container mt="24" pb="24" maxWidth={'2xl'}>
          <ChakraBox
            textAlign={'center'}
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            <Heading
              as={motion.h1}
              size="3xl"
              variants={FADE_UP_ANIMATION_VARIANTS}
              mb="4"
              textColor={'gray.700'}
            >
              Engaging LinkedIn Carousels, in a Flash
            </Heading>
            <ChakraContent
              variants={FADE_UP_ANIMATION_VARIANTS}
              mb="5"
              fontSize={'lg'}
              textColor={'gray.600'}
            >
              Craft captivating LinkedIn carousel posts (yourself or with AI) to
              elevate your professional image and foster more connections -
              seamlessly.
            </ChakraContent>
            <Button
              as={Link}
              href="/editor"
              px={10}
              py={6}
              mb="8"
              outline={'5px solid rgba(0, 102, 255, 0.2)'}
              fontSize={'xl'}
              fontWeight="bold"
              color="white"
              bgColor="rgb(0, 102, 255)"
              _hover={{
                bgColor: 'rgba(0, 102, 255, 0.8)',
              }}
            >
              Start creating
            </Button>
            <NextImage
              src="/app.png"
              width={4140 / 3}
              height={2580 / 3}
              alt="4px"
            />
          </ChakraBox>
        </Container>
      </Box>
      <Box className="gray-bg" py="24">
        <Container maxWidth={'6xl'}>
          <Heading
            as="h2"
            size="xl"
            mb="4"
            textAlign={'center'}
            textColor={'gray.700'}
          >
            Create prettier carousels, faster
          </Heading>
          <Box
            display={'grid'}
            gridTemplateColumns={'repeat(auto-fit, minmax(300px, 1fr))'}
            gap="4"
            mt="8"
          >
            {steps.map((step, i) => (
              <Box
                key={i}
                border="1px"
                borderColor={'gray.300'}
                borderRadius={'lg'}
              >
                <Box p="8">
                  <Box
                    borderRadius={'full'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bgColor="gray.700"
                    h="30px"
                    w="30px"
                    textColor={'white'}
                  >
                    {i + 1}
                  </Box>
                  <Heading
                    as="h3"
                    fontSize={'2xl'}
                    mt="1"
                    textColor={'gray.800'}
                  >
                    {step.title}
                  </Heading>
                  <Text
                    textColor={'gray.700'}
                    mt="3"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      <Container maxWidth={'6xl'} my="24">
        <Heading
          as="h2"
          size="xl"
          mb="4"
          textAlign={'center'}
          textColor={'gray.700'}
        >
          Templates to quickly get you started
        </Heading>
        <Templates />
        <Box
          bgGradient="linear(330deg, rgba(0, 102, 255, 0.9) 0%, rgba(0, 102, 255, 0.6) 100%)"
          mt="28"
          borderRadius={'lg'}
          p="8"
          position={'relative'}
        >
          <BackgroundSVG />
          <Box maxW="4xl" mx="auto">
            <Heading as="h2" fontSize={'4xl'} textColor={'white'}>
              Boost Your LinkedIn Game!
            </Heading>
            <Text textColor={'white'} mt="3">
              Create vibrant, engaging LinkedIn carousel posts effortlessly with
              our app. Stand out, captivate your audience, and amplify your
              message. Your professional story deserves to be heard
            </Text>
            <Button
              as={Link}
              href="/editor"
              px={8}
              py={4}
              mt="4"
              fontSize={'lg'}
              fontWeight="bold"
              color="gray.800"
              bgColor="rgba(255, 255, 255, 0.8)"
              _hover={{
                bgColor: 'white',
              }}
            >
              Start creating
            </Button>
          </Box>
        </Box>
      </Container>
      <hr />
      <Container maxWidth={'6xl'} my="6">
        <Text fontSize={'xs'} textColor={'gray.500'} textAlign={'center'}>
          Made with ❤️ by{' '}
          <Link href="https://twitter.com/imamanthakur">Aman</Link>
        </Text>
      </Container>
    </>
  );
}
