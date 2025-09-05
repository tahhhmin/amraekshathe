'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (status === 'authenticated' && session?.user && !session.user.id) {
        // New user, create account
        createAccount();
        }
    }, [status, session, router]);

    const createAccount = async () => {
        setCreating(true);
        try {
        const accountType = localStorage.getItem('accountType') || 'volunteer';
        
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            accountType,
            name: session?.user?.name,
            email: session?.user?.email,
            image: session?.user?.image,
            }),
        });

        if (response.ok) {
            localStorage.removeItem('accountType');
            window.location.reload(); // Refresh to get updated session
        }
        } catch (error) {
        console.error('Error creating account:', error);
        } finally {
        setCreating(false);
        }
    };

    if (status === 'loading' || creating) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
            {session.user?.image && (
                <img
                src={session.user.image}
                alt="Profile"
                style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                }}
                />
            )}

            <h1>Welcome, {session.user?.name}!</h1>
            <p>Email: {session.user?.email}</p>
            
            {session.user.accountType && (
                <p>Account Type: <strong>{session.user.accountType}</strong></p>
            )}

            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
                }}
            >
                Sign Out
            </button>
            </div>
        </div>
        </div>
    );
}