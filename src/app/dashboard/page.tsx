'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {/* Debug info */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Image URL:</strong> {session.user?.image || 'No image provided'}</p>
          </div>
          
          {session.user?.image ? (
            <div className="mb-4">
              <img
                className="mx-auto h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                src={session.user.image}
                alt="Profile"
                onLoad={() => console.log('✅ Image loaded successfully:', session.user?.image)}
                onError={(e) => {
                  console.error('❌ Image failed to load:', session.user?.image);
                  console.error('Error event:', e);
                  // Hide the broken image and show fallback
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Show the fallback div instead
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="mx-auto h-20 w-20 rounded-full bg-blue-500 items-center justify-center text-white text-2xl font-bold" 
                style={{ display: 'none' }}
              >
                {session.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <p className="text-xs mt-2 text-gray-500">Profile Picture</p>
            </div>
          ) : (
            <div className="mb-4">
              <div className="mx-auto h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {session.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <p className="text-xs mt-2 text-gray-500">Fallback Avatar</p>
            </div>
          )}
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome, {session.user?.name}!
          </h2>
          <p className="mt-2 text-gray-600">{session.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}