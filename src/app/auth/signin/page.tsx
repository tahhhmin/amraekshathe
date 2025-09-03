'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (accountType: 'volunteer' | 'organization') => {
    setLoading(true);
    localStorage.setItem('accountType', accountType);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Choose Account Type</h1>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <button
            onClick={() => handleSignIn('volunteer')}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🙋‍♂️ Sign in as Volunteer
          </button>
          
          <button
            onClick={() => handleSignIn('organization')}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🏢 Sign in as Organization
          </button>
        </div>
      </div>
    </div>
  );
}