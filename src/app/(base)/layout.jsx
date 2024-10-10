import 'bootstrap/dist/css/bootstrap.min.css'
import '../global.css';
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {Suspense} from "react";

export const metadata = {
  title: 'KYP',
  description: 'KYP gives students a platform to share their experiences with professors, helping fellow students gain valuable insights.',
};

export default function BaseLayout({ children }) {
  return (
    <html lang="en">
    <body>
    <Suspense>
      <Header />
    </Suspense>
    {children}
    <Footer />
    </body>
    </html>
  );
}
