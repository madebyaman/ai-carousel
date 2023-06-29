import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const MotionBox = motion(Box);

const Carousel = ({
  images,
  borderColor,
  onClick,
}: {
  images: string[];
  borderColor?: string;
  onClick?: () => void;
}) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      p="3"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      borderRadius={'md'}
      border="1px solid"
      borderColor={borderColor ? borderColor : 'gray.200'}
      bgColor={'transparent'}
      display={'inline-block'}
    >
      <MotionBox
        w="300px"
        h="300px"
        bgColor={'white'}
        overflow="hidden"
        position="relative"
      >
        <motion.div
          animate={{ x: `-${current * 100}%` }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          style={{
            display: 'flex',
          }}
        >
          {images.map((image, index) => (
            <Image key={image} width={300} height={300} alt="" src={image} />
          ))}
        </motion.div>
        <Flex
          position="absolute"
          bottom="3"
          right="3"
          color="white"
          bgColor={'rgba(0, 0 , 0, 0.5)'}
          borderRadius={'md'}
          p="0.5"
        >
          <Text fontSize={'xs'}>
            {current + 1} of {images.length}
          </Text>
        </Flex>
        <AnimatePresence initial={false}>
          {current > 0 && (
            <motion.button
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0, pointerEvents: 'none' }}
              whileHover={{ opacity: 1 }}
              aria-label="Previous Image"
              style={{
                position: 'absolute',
                left: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'black',
                borderRadius: '100%',
                padding: '12px',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgb(255, 255, 255)',
              }}
              onClick={prevSlide}
            >
              <IoChevronBack size="16" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {current + 1 < images.length && (
            <motion.button
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0, pointerEvents: 'none' }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'black',
                borderRadius: '100%',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                padding: '12px',
                backgroundColor: 'rgb(255, 255, 255)',
              }}
              aria-label="Next Image"
              onClick={nextSlide}
            >
              <IoChevronForward size="16" />
            </motion.button>
          )}
        </AnimatePresence>
      </MotionBox>
    </Box>
  );
};

export default Carousel;
