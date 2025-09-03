'use client';

import React, { useEffect, useState } from 'react';
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

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

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
                <button className={Styles.contactButton}>
                  Contact Organization
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

