import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        primaryColor: 'blue',
        defaultRadius: 'md',
        components: {
          Table: {
            styles: {
              root: {
                '& thead tr th': {
                  backgroundColor: '#f8f9fa',
                  fontWeight: 600,
                },
                '& tbody tr:hover': {
                  backgroundColor: '#f1f3f5',
                },
              },
            },
          },
          Paper: {
            styles: {
              root: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              },
            },
          },
        },
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}
