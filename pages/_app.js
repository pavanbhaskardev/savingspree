import Layout from "@/components/Layout";
import { AppProvider } from "@/firebase/auth";
import { DatabaseProvider } from "@/firebase/database";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/components/theme";
import "../public/styles.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <AppProvider>
          <DatabaseProvider>
            <Layout>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <Component {...pageProps} />
            </Layout>
          </DatabaseProvider>
        </AppProvider>
      </ChakraProvider>
    </>
  );
}
