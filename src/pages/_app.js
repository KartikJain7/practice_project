import { AuthProvider } from "../config/AuthContext";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Phone Directory</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
