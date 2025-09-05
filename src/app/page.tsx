'use client';
import Link from 'next/link';
import Styles from './styles/page.module.css';
import Button from '@/components/common/button/Button';
import { useSession, signIn, signOut } from 'next-auth/react';
import HeroSection from '@/components/home-page/HeroSection';
import HeroImage from '@/components/home-page/HeroImage';

export default function Home() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <main className={Styles.page}>
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className={Styles.page}>
            {/* Auth Status Display */}
            <HeroSection />

            <div className={Styles.heroImage}>
                <HeroImage />
            </div>
            

            <div style={{ 
                padding: '1rem', 
                background: session ? '#d4edda' : '#f8d7da', 
                border: `1px solid ${session ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '5px',
                margin: '1rem 0'
            }}>
                {session ? (
                    <div>
                        <p>✅ <strong>Signed In</strong></p>
                        <p>Name: {session.user?.name}</p>
                        <p>Email: {session.user?.email}</p>
                        <p>User Type: {session.user?.accountType || 'Needs to complete signup'}</p>
                        <button 
                            onClick={() => signOut()}
                            style={{ 
                                background: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                padding: '0.5rem 1rem',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                marginTop: '0.5rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>❌ <strong>Not Signed In</strong></p>
                )}
            </div>

            <p>Home Page</p>

            <div className={Styles.container}>
                {!session ? (
                    // Show login buttons if not authenticated
                    <>
                        <Link href="/auth/signin?type=volunteer" className={Styles.featureButton}>
                            <Button
                                variant='primary'
                                label='Join as Volunteer'
                                showIcon
                            />
                        </Link>
                    
                        <Link href="/auth/signin?type=organization" className={Styles.featureButton}>
                            <Button
                                variant='primary'
                                label='Join as Organization'
                                showIcon
                            />
                        </Link>
                    </>
                ) : session.user?.accountType ? (
                    // Show dashboard links if user type is set
                    <div>
                        <h3>Welcome back, {session.user.name}! 👋</h3>
                        {session.user.accountType === 'volunteer' ? (
                            <Link href="/volunteer/dashboard" className={Styles.featureButton}>
                                <Button
                                    variant='primary'
                                    label='Go to Volunteer Dashboard'
                                    showIcon
                                />
                            </Link>
                        ) : (
                            <Link href="/organization/dashboard" className={Styles.featureButton}>
                                <Button
                                    variant='primary'
                                    label='Go to Organization Dashboard'
                                    showIcon
                                />
                            </Link>
                        )}
                    </div>
                ) : (
                    // Show signup completion if authenticated but no user type
                    <div>
                        <h3>Complete Your Profile</h3>
                        <p>You're signed in, but need to choose your account type:</p>
                        <Link href="/auth/signup/volunteer" className={Styles.featureButton}>
                            <Button
                                variant='primary'
                                label='Complete as Volunteer'
                                showIcon
                            />
                        </Link>
                    
                        <Link href="/auth/signup/organization" className={Styles.featureButton}>
                            <Button
                                variant='primary'
                                label='Complete as Organization'
                                showIcon
                            />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}