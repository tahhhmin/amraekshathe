'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Button from '@/components/common/button/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button
        variant="loading"
        label="Loading..."
        showIcon
      />
    );
  }

  if (session) {
    const profileUrl = session.user?.accountType === 'volunteer' 
      ? '/dashboard' 
      : '/dashboard';

    return (
      <Link href={profileUrl}>
        <button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            padding: '0',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0'
          }}
        >
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt="Profile"
              width={40}
              height={40}
              style={{
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#007bff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </button>
      </Link>
    );
  }

  return (
    <Link href='/auth/signin'>
        <Button
            variant="primary"
            label="Sign in"
            showIcon
        />
    </Link>
  );
}