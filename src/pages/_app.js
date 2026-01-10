import BaseLayout from "@/components/layout/BaseLayout";
import "@/styles/globals.css";
import Head from 'next/head';

// Font Awesome configuration to prevent FOUC
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Employee Management Dashboard</title>
        <meta name="description" content="Employee Management System built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </>
  );
}
