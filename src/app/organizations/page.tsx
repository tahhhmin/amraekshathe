'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styles from './page.module.css';
import ProgressBar from '@/components/common/Progress/ProgressBar';
import IndeterminateProgressBar from '@/components/common/Progress/FreeProgressBar';

interface Organization {
  _id: string;
  name: string;
  email: string;
  image?: string;
  organizationName: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  createdAt: string;
}

interface JoinRequestModal {
  isOpen: boolean;
  organizationId: string;
  organizationName: string;
}

export default function OrganizationsPage() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinRequestModal, setJoinRequestModal] = useState<JoinRequestModal>({
    isOpen: false,
    organizationId: '',
    organizationName: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrganizations();
    if (session?.user?.id) {
      fetchPendingRequests();
    }
  }, [session]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organization/get-all');
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError('Failed to load organizations');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      if (!session?.user?.id) return;
      
      // You'll need to create this API endpoint to fetch pending requests
      const response = await fetch(`/api/volunteer/join-request/pending?volunteerId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        const pendingOrgIds = new Set<string>(
          data.requests?.map((req: { organizationId: string }) => req.organizationId) || []
        );
        setPendingRequests(pendingOrgIds);
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const openJoinRequestModal = (organizationId: string, organizationName: string) => {
    setJoinRequestModal({
      isOpen: true,
      organizationId,
      organizationName
    });
    setMessage('');
  };

  const closeJoinRequestModal = () => {
    setJoinRequestModal({
      isOpen: false,
      organizationId: '',
      organizationName: ''
    });
    setMessage('');
    setIsSubmitting(false);
  };

  const handleSendJoinRequest = async () => {
    if (!session?.user?.id) {
      alert('Please log in to send join requests');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/volunteer/join-request/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volunteerId: session.user.id,
          organizationId: joinRequestModal.organizationId,
          message: message.trim() || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Join request sent successfully!');
        setPendingRequests(prev => new Set([...prev, joinRequestModal.organizationId]));
        closeJoinRequestModal();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      alert('Failed to send join request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getJoinRequestButtonText = (orgId: string) => {
    if (pendingRequests.has(orgId)) {
      return 'Request Pending';
    }
    return 'Send Join Request';
  };

  const isJoinRequestDisabled = (orgId: string) => {
    return pendingRequests.has(orgId) || !session?.user?.id;
  };

  if (loading) {
    return (
      <main className={Styles.page}>
        <h1>Organizations</h1>
        <div className={Styles.loading}>
          <IndeterminateProgressBar />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={Styles.page}>
        <h1>Organizations</h1>
        <div className={Styles.error}>{error}</div>
      </main>
    );
  }

  return (
    <main className={Styles.page}>
      <h1>Organizations</h1>
      <div className={Styles.organizationsGrid}>
        {organizations.length === 0 ? (
          <p className={Styles.noOrganizations}>No organizations found.</p>
        ) : (
          organizations.map((org) => (
            <div key={org._id} className={Styles.organizationCard}>
              <div className={Styles.organizationHeader}>
                {org.image ? (
                  <img
                    src={org.image}
                    alt={org.organizationName}
                    className={Styles.organizationImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={Styles.organizationImagePlaceholder}>
                    🏢
                  </div>
                )}
                <div className={Styles.organizationInfo}>
                  <h3 className={Styles.organizationName}>
                    {org.organizationName}
                    {org.isVerified && (
                      <span className={Styles.verifiedBadge} title="Verified Organization">
                        ✓
                      </span>
                    )}
                  </h3>
                  <p className={Styles.contactName}>Contact: {org.name}</p>
                </div>
              </div>

              {org.description && (
                <p className={Styles.organizationDescription}>
                  {org.description}
                </p>
              )}

              <div className={Styles.organizationDetails}>
                {org.website && (
                  <div className={Styles.detailItem}>
                    <span className={Styles.detailLabel}>Website:</span>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={Styles.websiteLink}
                    >
                      {org.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                {org.phone && (
                  <div className={Styles.detailItem}>
                    <span className={Styles.detailLabel}>Phone:</span>
                    <span>{org.phone}</span>
                  </div>
                )}

                {org.address && (
                  <div className={Styles.detailItem}>
                    <span className={Styles.detailLabel}>Address:</span>
                    <span>{org.address}</span>
                  </div>
                )}

                <div className={Styles.detailItem}>
                  <span className={Styles.detailLabel}>Email:</span>
                  <span>{org.email}</span>
                </div>
              </div>

              <div className={Styles.organizationFooter}>
                <span className={Styles.joinedDate}>
                  Joined: {new Date(org.createdAt).toLocaleDateString()}
                </span>
                <div className={Styles.buttonGroup}>
                  <button className={Styles.contactButton}>
                    Contact Organization
                  </button>
                  <button 
                    className={`${Styles.joinRequestButton} ${
                      isJoinRequestDisabled(org._id) ? Styles.disabled : ''
                    }`}
                    onClick={() => openJoinRequestModal(org._id, org.organizationName)}
                    disabled={isJoinRequestDisabled(org._id)}
                  >
                    {getJoinRequestButtonText(org._id)}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Join Request Modal */}
      {joinRequestModal.isOpen && (
        <div className={Styles.modalOverlay} onClick={closeJoinRequestModal}>
          <div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={Styles.modalHeader}>
              <h3>Send Join Request</h3>
              <button 
                className={Styles.closeButton}
                onClick={closeJoinRequestModal}
              >
                ×
              </button>
            </div>
            
            <div className={Styles.modalContent}>
              <p>Send a join request to <strong>{joinRequestModal.organizationName}</strong></p>
              
              <div className={Styles.messageField}>
                <label htmlFor="message">Message (optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Why would you like to join this organization?"
                  className={Styles.messageTextarea}
                  rows={4}
                  maxLength={500}
                />
                <div className={Styles.characterCount}>
                  {message.length}/500 characters
                </div>
              </div>
            </div>

            <div className={Styles.modalFooter}>
              <button
                className={Styles.cancelButton}
                onClick={closeJoinRequestModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={Styles.sendButton}
                onClick={handleSendJoinRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}