// app/page.tsx or pages/index.tsx

import React, { useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import './globals.css'; // Ensure you import your global CSS file

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.redirected) {
      router.push('/chat');
    }
  }, [router]);

  return (
    <div>
      <ClerkProvider>
        <div className="navbar">
          <SignedOut>
            <SignInButton mode="modal"  />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <h1>Hello World</h1>
      </ClerkProvider>
    </div>
  );
};

export default HomePage;
