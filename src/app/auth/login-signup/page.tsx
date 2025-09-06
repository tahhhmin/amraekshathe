'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Styles from './page.module.css'
import Button from '@/components/common/button/Button';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<'volunteer' | 'organization' | null>(null);
    const router = useRouter();

    const handleSignIn = async (accountType: 'volunteer' | 'organization', event: React.MouseEvent) => {
        event.preventDefault();
        setLoading(true);
        setLoadingType(accountType);
        
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('accountType', accountType);
            }
            
            // Set different callback URLs based on account type
            const callbackUrl = accountType === 'volunteer' 
                ? '/volunteer/profile' 
                : '/organization/dashboard';
            
            await signIn('google', { callbackUrl });
        } catch (error) {
            console.error('Sign in error:', error);
            setLoading(false);
            setLoadingType(null);
        }
    };

    const handleBackClick = () => {
        router.back();
    };

    return (
        <main className={Styles.page}>

            <div className={Styles.sidebarContainer}>
                <div className={Styles.buttonContainerHeader}>
                    <div className={Styles.headerButton} onClick={handleBackClick}>
                        <Button
                            variant='icon'
                            showIcon
                            icon='ArrowLeft'
                            shapeless={true}
                        />
                    </div>

                    <div className={Styles.headerItem}>
                        <h2 className={Styles.title}>Choose Account Type</h2>
                    </div>
                </div>

                <div className={Styles.buttonContainer}>
                    <a 
                        href="#" 
                        className={Styles.selectButton}
                        onClick={(e) => handleSignIn('volunteer', e)}
                        style={{ 
                            opacity: loading && loadingType !== 'volunteer' ? 0.5 : 1,
                            pointerEvents: loading && loadingType !== 'volunteer' ? 'none' : 'auto'
                        }}
                    >
                        <span className={Styles.buttonLabel}>
                            <ArrowUpRight size={32} className={Styles.icon}/>
                            {loading && loadingType === 'volunteer' 
                                ? 'Signing up...' 
                                : 'Signup as a volunteer'
                            }
                        </span>
                    </a>

                    <a 
                        href="#" 
                        className={Styles.selectButton}
                        onClick={(e) => handleSignIn('organization', e)}
                        style={{ 
                            opacity: loading && loadingType !== 'organization' ? 0.5 : 1,
                            pointerEvents: loading && loadingType !== 'organization' ? 'none' : 'auto'
                        }}
                    >
                        <span className={Styles.buttonLabel}>
                            <ArrowUpRight size={32} className={Styles.icon}/>
                            {loading && loadingType === 'organization' 
                                ? 'Signing up...' 
                                : 'Signup as an organization'
                            }
                        </span>
                    </a>
                </div>
            </div>

            <div className={Styles.imageContainer}>

            </div>

        </main>
    );
}