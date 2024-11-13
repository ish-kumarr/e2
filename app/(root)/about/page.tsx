// pages/about.js
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>Coming Soon - About Us</title>
        <meta name="description" content="This page is coming soon." />
      </Head>
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-4">Coming Soon</h1>
          <p className="text-gray-400 text-lg">We are working on this page. Stay tuned!</p>
        </div>
      </div>
    </>
  );
}
