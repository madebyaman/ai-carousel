import '@/styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = extendTheme({
  fonts: {
    heading:
      'DM Sans, --apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
    body: 'DM Sans',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <main className={`${dmSans.className}`}>
        <Component {...pageProps} />
      </main>
    </ChakraProvider>
  );
}
