// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import TooltipProvider from '../components/ui/TooltipProvider';

function MyApp({ Component, pageProps }) {
  return (
    <TooltipProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TooltipProvider>
  );
}

export default MyApp;