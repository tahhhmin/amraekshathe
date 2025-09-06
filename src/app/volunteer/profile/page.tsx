'use client'

import React from 'react'
import Styles from './page.module.css'
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import OrgList from '@/components/volunteer-profile/OrgList';
import VolunteerProfileForm from '@/components/volunteer-profile/update-profile';

export default function page() {
    const { data: session, status } = useSession();

    // Function to get high quality Google profile image
    const getHighQualityImage = (imageUrl: string) => {
        if (!imageUrl) return imageUrl;
        
        // Google profile images have size parameters we can modify
        // Replace s96-c (96px) with s400-c (400px) for higher quality
        return imageUrl
            .replace(/s96-c/g, 's400-c')
            .replace(/s64-c/g, 's400-c')
            .replace(/s32-c/g, 's400-c')
            .replace(/=s96-c/g, '=s400-c')
            .replace(/=s64-c/g, '=s400-c')
            .replace(/=s32-c/g, '=s400-c');
    };

    return (
        <main className={Styles.page}>
            <div className={Styles.pageContainer}>
            {session ? (
                    <div className={Styles.pageContainer}>

                        <div className={Styles.profileHeader}>

                            <div className={Styles.profileImage}>
                                {session.user?.image && (
                                    <Image
                                        src={getHighQualityImage(session.user.image)}
                                        alt="Profile"
                                        width={240}
                                        height={240}
                                        className={Styles.profileImg}
                                        priority
                                        quality={95}
                                    />
                                )}
                            </div>

                            <div>
                                <p className={Styles.username}>@{session.user?.email?.split('@')[0]}</p>
                                <p className={Styles.name}>{session.user?.name}</p>
                            </div>  
                        </div>

                        <div>
                            <OrgList/>
                        </div>

                        <VolunteerProfileForm />

                        <button onClick={() => signOut()} className={Styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>Not signed in</p>    
                )
            }
            </div>
        </main> 
    )
}