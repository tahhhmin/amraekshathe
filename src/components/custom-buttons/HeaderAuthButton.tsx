'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Styles from './HeaderAuthButton.module.css'

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
        <p>Loading...</p>
    );
  }

  if (session) {
    const profileUrl = session.user?.accountType === 'volunteer' 
      ? '/volunteer/profile' 
      : '/organization/dashboard';

    return (
      <Link href={profileUrl} className={Styles.link}>
        <p>Profile</p>
      </Link>
    );
  }

  return (
    <Link href='/auth/login-signup' className={Styles.link}>
        <p>Login / Signup</p>
    </Link>
  );
}