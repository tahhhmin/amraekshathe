'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  image?: string;
  dateOfBirth?: string;
  role: string;
  joinedAt: string;
  organizationVolunteerId: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    volunteers: Volunteer[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      total: number;
      roles: Record<string, number>;
    };
    filters: {
      organizationId: string;
      role: string;
      search: string | null;
      sortBy: string;
      sortOrder: string;
    };
  };
  message?: string;
}

interface VolunteerListProps {
  organizationId?: string;
}

export default function VolunteerList({ organizationId: propOrganizationId }: VolunteerListProps) {
  const { data: session } = useSession();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null);
  const [summary, setSummary] = useState<ApiResponse['data']['summary'] | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Use prop organizationId or get from session
  const organizationId = propOrganizationId || session?.user?.id;

  useEffect(() => {
    if (organizationId) {
      fetchVolunteers();
    }
  }, [organizationId, currentPage, roleFilter, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (organizationId) {
        setCurrentPage(1); // Reset to first page on search
        fetchVolunteers();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchVolunteers = async () => {
    if (!organizationId) {
      setError('Organization ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        organizationId,
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      });

      if (roleFilter !== 'all') {
        params.append('role', roleFilter);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/organization/volunteers/get-all?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch volunteers');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setVolunteers(data.data.volunteers);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
      } else {
        throw new Error(data.message || 'Failed to fetch volunteers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVolunteerAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRoleChange = (newRole: string) => {
    setRoleFilter(newRole);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (!organizationId) {
    return (
      <div className="volunteer-list-container">
        <div className="error-message">
          Please log in or provide an organization ID to view volunteers.
        </div>
      </div>
    );
  }

  if (loading && volunteers.length === 0) {
    return (
      <div className="volunteer-list-container">
        <h2>Organization Volunteers</h2>
        <div className="loading-spinner">Loading volunteers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="volunteer-list-container">
        <h2>Organization Volunteers</h2>
        <div className="error-message">
          {error}
          <button onClick={fetchVolunteers} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-list-container">
      <div className="header">
        <h2>Organization Volunteers</h2>
        {summary && (
          <div className="summary-stats">
            <span className="total-count">{summary.total} total volunteers</span>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search volunteers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="role-filter">
            <label>Filter by Role:</label>
            <select 
              value={roleFilter} 
              onChange={(e) => handleRoleChange(e.target.value)}
              className="role-select"
            >
              <option value="all">All Roles</option>
              {summary && Object.keys(summary.roles).map(role => (
                <option key={role} value={role}>
                  {role} ({summary.roles[role]})
                </option>
              ))}
            </select>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <button
              onClick={() => handleSortChange('name')}
              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('joinedAt')}
              className={`sort-btn ${sortBy === 'joinedAt' ? 'active' : ''}`}
            >
              Joined {sortBy === 'joinedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('role')}
              className={`sort-btn ${sortBy === 'role' ? 'active' : ''}`}
            >
              Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Role Summary */}
      {summary && Object.keys(summary.roles).length > 1 && (
        <div className="role-summary">
          {Object.entries(summary.roles).map(([role, count]) => (
            <div key={role} className="role-badge">
              <span className="role-name">{role}</span>
              <span className="role-count">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Volunteers Grid */}
      {volunteers.length === 0 ? (
        <div className="no-volunteers">
          <p>No volunteers found.</p>
          {searchTerm && <p>Try adjusting your search or filters.</p>}
        </div>
      ) : (
        <>
          <div className="volunteers-grid">
            {volunteers.map((volunteer) => (
              <div key={volunteer._id} className="volunteer-card">
                <div className="volunteer-avatar">
                  {volunteer.image ? (
                    <img
                      src={volunteer.image}
                      alt={volunteer.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {volunteer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="volunteer-info">
                  <h3 className="volunteer-name">{volunteer.name}</h3>
                  <p className="volunteer-email">{volunteer.email}</p>
                  
                  <div className="volunteer-details">
                    <div className="detail-item">
                      <span className="label">Role:</span>
                      <span className={`role-tag role-${volunteer.role.toLowerCase()}`}>
                        {volunteer.role}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">Joined:</span>
                      <span>{formatDate(volunteer.joinedAt)}</span>
                    </div>
                    
                    {volunteer.dateOfBirth && (
                      <div className="detail-item">
                        <span className="label">Age:</span>
                        <span>{getVolunteerAge(volunteer.dateOfBirth)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="volunteer-actions">
                  <button className="contact-btn">Contact</button>
                  <button className="manage-btn">Manage</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="pagination-button"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .volunteer-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 28px;
        }

        .total-count {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 14px;
        }

        .controls {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .search-box {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filters {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .role-filter label,
        .sort-controls label {
          font-weight: 500;
          color: #374151;
          margin-right: 8px;
        }

        .role-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-btn {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .sort-btn:hover {
          background: #f3f4f6;
        }

        .sort-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .role-summary {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .role-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f3f4f6;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 14px;
        }

        .role-name {
          font-weight: 500;
          color: #374151;
        }

        .role-count {
          background: #6b7280;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
        }

        .volunteers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .volunteer-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s ease;
        }

        .volunteer-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .volunteer-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 16px;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .volunteer-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 24px;
          font-weight: bold;
          color: #6b7280;
        }

        .volunteer-info {
          text-align: center;
          margin-bottom: 20px;
        }

        .volunteer-name {
          margin: 0 0 4px 0;
          color: #1f2937;
          font-size: 18px;
        }

        .volunteer-email {
          color: #6b7280;
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .volunteer-details {
          text-align: left;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding: 4px 0;
        }

        .detail-item .label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .role-tag {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .role-volunteer {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-coordinator {
          background: #d1fae5;
          color: #047857;
        }

        .role-manager {
          background: #fef3c7;
          color: #d97706;
        }

        .volunteer-actions {
          display: flex;
          gap: 8px;
        }

        .contact-btn, .manage-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .contact-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .contact-btn:hover {
          background: #e5e7eb;
        }

        .manage-btn {
          background: #667eea;
          color: white;
        }

        .manage-btn:hover {
          background: #5b6ce8;
        }

        .no-volunteers {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .no-volunteers p {
          margin: 10px 0;
          font-size: 16px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-button {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 14px;
          color: #6b7280;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          font-size: 16px;
          color: #6b7280;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .retry-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          margin-top: 10px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .volunteer-list-container {
            padding: 15px;
          }

          .volunteers-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .sort-controls {
            flex-wrap: wrap;
          }

          .header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}