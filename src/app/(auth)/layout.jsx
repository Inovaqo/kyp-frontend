import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import '../global.css';
import Image from 'next/image';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata = {
  title: 'KYP',
  description: 'KYP gives students a platform to share their experiences with professors, helping fellow students gain valuable insights.',
};
export default function AuthLayout({ children }) {
  return (
    <html lang="en">
    <body style={{height:'100vh'}}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
    <main style={{height:'inherit'}}>
      <section style={{height:'inherit'}} className="auth-background-image">
        <div style={{height:'inherit'}} className="px-120 py-200 tablet-px-90 tablet-px-50 mobile-px-20 flex items-center ">
          <div className="row full-width tablet-mx-0">
            <div className="col-4 d-none d-xl-flex  flex column justify-center">
              <Image className="mb-3" height={35} width={70} src="/KYPwhiteIcon.png" alt="KYPwhiteIcon" />
              <p className="text-ffffff text-16 text-weight-400" style={{width:'380px'}}>KYP gives students a platform to share their experiences with professors, helping fellow students gain valuable insights. </p>
            </div>
            <div className="col-12 col-xl-8 d-flex justify-content-center justify-content-xl-end">
              {children}
            </div>
          </div>
        </div>

      </section>
    </main>
    </GoogleOAuthProvider>
    </body>
    </html>
  );
}
