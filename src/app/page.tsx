'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
    const { data: session } = useSession();
    
    return (
        <main>
            {session ? (
                <div>
                    Welcome back, {session.user?.name}!
                </div>
            ) : (
                <div>
                    <Link href="/auth/signin" >
                        Sign In
                    </Link>
                </div>
            )}
        </main>
    );
}