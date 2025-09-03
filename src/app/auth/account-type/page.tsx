'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountTypeSelection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleAccountTypeSelection = async (accountType: 'volunteer' | 'organization') => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountType,
          userData: session?.user,
        }),
      });

      if (response.ok) {
        if (accountType === 'organization') {
          router.push('/auth/organization-setup');
        } else {
          router.push('/dashboard');
        }
      } else {
        console.error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Choose Your Account Type
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select how you want to use the platform
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleAccountTypeSelection('volunteer')}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🙋‍♂️</div>
              <h3 className="font-semibold text-gray-900">Volunteer</h3>
              <p className="text-sm text-gray-600">
                Find and join volunteer opportunities
              </p>
            </div>
          </button>

          <button
            onClick={() => handleAccountTypeSelection('organization')}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="font-semibold text-gray-900">Organization</h3>
              <p className="text-sm text-gray-600">
                Post volunteer opportunities and manage events
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}