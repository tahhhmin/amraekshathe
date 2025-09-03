'use client';

import React from 'react';
import Styles from './page.module.css';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CreateProjectForm from '@/components/organization/CreateProjectForm';
import PendingJoinRequestsList from '@/components/organization/PendingJoinRequestsList';
import VolunteerList from '@/components/organization/VolunteerList';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
        <main className={Styles.page}>
            <p>Loading...</p>
        </main>
        );
    }

    if (!session) {
        router.push('/');
        return (
        <main className={Styles.page}>
            <p>Redirecting...</p>
        </main>
        );
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <main className={Styles.page}>
            {session.user?.image && (
                <Image
                src={session.user.image}
                alt="Profile"
                width={80}
                height={80}
                style={{ 
                    borderRadius: '50%', 
                    marginBottom: '1rem',
                    objectFit: 'cover'
                }}
                />
            )}
            
            <h1>Welcome, {session.user?.name}!</h1>
            <p>Email: {session.user?.email}</p>
            
            {session.user?.accountType && (
                <p>Account Type: <strong>{session.user.accountType}</strong></p>
            )}

            <CreateProjectForm />

            {/* Show Organization-specific content */}
            {session.user?.accountType === 'organization' && (
                <>
                    {/* Pending Join Requests Section */}
                    <div className={Styles.pendingRequestsSection}>
                        <PendingJoinRequestsList organizationId={session.user.id} />
                    </div>

                    {/* Current Volunteers Section */}
                    <div className={Styles.volunteersSection}>
                        <VolunteerList organizationId={session.user.id} />
                    </div>
                </>
            )}
        </main>
    );
}