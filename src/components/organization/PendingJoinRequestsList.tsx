'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  image?: string;
  dateOfBirth?: string;
}

interface JoinRequest {
  _id: string;
  volunteerId: Volunteer;
  organizationId: string;
  projectId?: string;
  status: 'pending' | 'accepted' | 'rejected';
  role: string;
  message?: string;
  requestby: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    joinRequests: JoinRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      pending: number;
      accepted: number;
      rejected: number;
      total: number;
    };
  };
  message?: string;
}

interface PendingJoinRequestsListProps {
  organizationId?: string;
}

function PendingJoinRequestsList({ organizationId: propOrganizationId }: PendingJoinRequestsListProps) {
  const { data: session } = useSession();
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null);
  const [summary, setSummary] = useState<ApiResponse['data']['summary'] | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  // Use prop organizationId or get from session
  const organizationId = propOrganizationId || session?.user?.id;

  useEffect(() => {
    if (organizationId) {
      fetchPendingRequests();
    }
  }, [organizationId, currentPage]);

  const fetchPendingRequests = async () => {
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
        status: 'pending',
        page: currentPage.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/organization/join-request/get-all?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch join requests');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setJoinRequests(data.data.joinRequests);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
      } else {
        throw new Error(data.message || 'Failed to fetch join requests');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching pending join requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      setProcessingRequest(requestId);

      const response = await fetch(`/api/organization/join-request/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          organizationId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message with volunteer name
        const successMessage = action === 'accept' 
          ? `✅ ${data.data.volunteerName} has been accepted as a ${data.data.role}!`
          : `❌ ${data.data.volunteerName}'s request has been rejected.`;
        
        alert(successMessage);
        
        // Refresh the requests list to remove the processed request
        await fetchPendingRequests();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request. Please try again.`);
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!organizationId) {
    return (
      <div className="pending-requests-container">
        <div className="error-message">
          Please log in or provide an organization ID to view join requests.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pending-requests-container">
        <h2>Pending Join Requests</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pending-requests-container">
        <h2>Pending Join Requests</h2>
        <div className="error-message">
          {error}
          <button onClick={fetchPendingRequests} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-requests-container">
      <div className="header">
        <h2>Pending Join Requests</h2>
        {summary && (
          <div className="summary-badge">
            {summary.pending} pending request{summary.pending !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {joinRequests.length === 0 ? (
        <div className="no-requests">
          <p>No pending join requests at the moment.</p>
          <p>Check back later or encourage volunteers to join your organization!</p>
        </div>
      ) : (
        <>
          <div className="requests-list">
            {joinRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="volunteer-info">
                  <div className="volunteer-avatar">
                    {request.volunteerId.image ? (
                      <img
                        src={request.volunteerId.image}
                        alt={request.volunteerId.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {request.volunteerId.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="volunteer-details">
                    <h3>{request.volunteerId.name}</h3>
                    <p className="volunteer-email">{request.volunteerId.email}</p>
                    {request.volunteerId.dateOfBirth && (
                      <p className="volunteer-age">
                        Age: {getVolunteerAge(request.volunteerId.dateOfBirth)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="request-details">
                  <div className="request-info">
                    <p><strong>Role:</strong> {request.role}</p>
                    <p><strong>Requested:</strong> {formatDate(request.createdAt)}</p>
                    <p><strong>Request Type:</strong> {request.requestby}</p>
                  </div>

                  {request.message && (
                    <div className="request-message">
                      <h4>Message:</h4>
                      <p>"{request.message}"</p>
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  <button
                    onClick={() => handleRequestAction(request._id, 'accept')}
                    disabled={processingRequest === request._id}
                    className="accept-button"
                  >
                    {processingRequest === request._id ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleRequestAction(request._id, 'reject')}
                    disabled={processingRequest === request._id}
                    className="reject-button"
                  >
                    {processingRequest === request._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!pagination.hasPrevPage}
                className="pagination-button"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNextPage}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PendingJoinRequestsList;