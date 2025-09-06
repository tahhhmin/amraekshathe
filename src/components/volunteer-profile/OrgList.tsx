'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Styles from './OrgList.module.css';

interface Organization {
  _id: string;
  name: string;
  organizationName: string;
  image?: string;
  email: string;
  projectCount: number;
  volunteerCount: number;
  role: string;
  joinedAt: string;
  createdAt: string;
}

export default function OrgList() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrganizations();
    }
  }, [session]);

  const fetchOrganizations = async (): Promise<void> => {
    try {
      const response = await fetch('/api/volunteer/get-joined-orgs');
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data: Organization[] = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError('Failed to load organizations');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin': return '#dc3545';
      case 'coordinator': return '#fd7e14';
      case 'lead': return '#6f42c1';
      default: return '#28a745';
    }
  };

  if (!session) {
    return (
      <div className={Styles.container}>
        <p className={Styles.message}>Please sign in to view your organizations</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={Styles.container}>
        <div className={Styles.loading}>
          <div className={Styles.spinner}></div>
          <p>Loading your organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={Styles.container}>
        <div className={Styles.error}>
          <p>{error}</p>
          <button onClick={fetchOrganizations} className={Styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className={Styles.container}>
        <div className={Styles.emptyState}>
          <div className={Styles.emptyIcon}>🏢</div>
          <h3>No Organizations Yet</h3>
          <p>You haven't joined any organizations yet. Start by browsing available organizations!</p>
          <button className={Styles.browseButton}>
            Browse Organizations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h2>My Organizations</h2>
        <p className={Styles.subtitle}>
          {organizations.length} organization{organizations.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={Styles.organizationGrid}>
        {organizations.map((org) => (
          <div key={org._id} className={Styles.orgCard}>
            <div className={Styles.orgHeader}>
              <div className={Styles.orgImage}>
                {org.image ? (
                  <Image
                    src={org.image}
                    alt={org.organizationName}
                    width={60}
                    height={60}
                    className={Styles.orgImg}
                  />
                ) : (
                  <div className={Styles.orgImagePlaceholder}>
                    {org.organizationName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className={Styles.orgInfo}>
                <h3 className={Styles.orgName}>{org.organizationName}</h3>
                <p className={Styles.contactName}>Contact: {org.name}</p>
              </div>

              <div 
                className={Styles.roleTag}
                style={{ backgroundColor: getRoleColor(org.role) }}
              >
                {org.role}
              </div>
            </div>

            <div className={Styles.orgStats}>
              <div className={Styles.stat}>
                <span className={Styles.statNumber}>{org.projectCount}</span>
                <span className={Styles.statLabel}>Projects</span>
              </div>
              <div className={Styles.stat}>
                <span className={Styles.statNumber}>{org.volunteerCount}</span>
                <span className={Styles.statLabel}>Volunteers</span>
              </div>
            </div>

            <div className={Styles.orgFooter}>
              <div className={Styles.joinInfo}>
                <small>Joined: {formatDate(org.joinedAt)}</small>
              </div>
              
              <div className={Styles.orgActions}>
                <button className={Styles.viewButton}>
                  View Details
                </button>
                <button className={Styles.projectsButton}>
                  Projects
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}