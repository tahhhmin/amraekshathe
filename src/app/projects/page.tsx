'use client';

import React, { useState, useEffect } from 'react';
import Styles from './page.module.css';

interface Project {
    _id: string;
    ownerOrganisationId: string[];
    title: string;
    description: string;
    address: string;
    coordinates?: number[];
    volunteers: Array<{
        volunteerId: string;
        role: string;
        score: number;
    }>;
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    organization: {
        _id: string;
        organizationName: string;
        name: string;
        image?: string;
        email: string;
    } | null;
    volunteerCount: number;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    data: {
        projects: Project[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            limit: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
        summary: {
            draft: number;
            active: number;
            completed: number;
            cancelled: number;
            total: number;
        };
        filters: {
            status: string;
            organizationId: string | null;
            search: string | null;
            sortBy: string;
            sortOrder: string;
        };
    };
    message?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null);
    const [summary, setSummary] = useState<ApiResponse['data']['summary'] | null>(null);
    
    // Filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchProjects();
    }, [currentPage, statusFilter, sortBy, sortOrder]);

    // Debounce search
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            setCurrentPage(1);
            fetchProjects();
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '12',
                sortBy,
                sortOrder
            });

            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            const response = await fetch(`/api/projects/get-all?${params}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data: ApiResponse = await response.json();
            
            if (data.success) {
                setProjects(data.data.projects);
                setPagination(data.data.pagination);
                setSummary(data.data.summary);
            } else {
                throw new Error(data.message || 'Failed to fetch projects');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching projects:', err);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return '#6b7280';
            case 'active': return '#059669';
            case 'completed': return '#2563eb';
            case 'cancelled': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
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

    if (loading && projects.length === 0) {
        return (
            <main className={Styles.page}>
                <h1>Projects</h1>
                <div className="loading">Loading projects...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className={Styles.page}>
                <h1>Projects</h1>
                <div className="error">
                    {error}
                    <button onClick={fetchProjects} className="retry-button">
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className={Styles.page}>
            <div className="header">
                <h1>Projects</h1>
                {summary && (
                    <div className="summary">
                        {summary.total} total projects
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search projects by title, description, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters">
                    <div className="status-filter">
                        <label>Status:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="status-select"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft ({summary?.draft || 0})</option>
                            <option value="active">Active ({summary?.active || 0})</option>
                            <option value="completed">Completed ({summary?.completed || 0})</option>
                            <option value="cancelled">Cancelled ({summary?.cancelled || 0})</option>
                        </select>
                    </div>

                    <div className="sort-controls">
                        <label>Sort by:</label>
                        <button
                            onClick={() => handleSortChange('createdAt')}
                            className={`sort-btn ${sortBy === 'createdAt' ? 'active' : ''}`}
                        >
                            Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSortChange('title')}
                            className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
                        >
                            Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSortChange('status')}
                            className={`sort-btn ${sortBy === 'status' ? 'active' : ''}`}
                        >
                            Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            {summary && (
                <div className="status-summary">
                    <div className="status-card" style={{ borderColor: getStatusColor('draft') }}>
                        <span className="status-number">{summary.draft}</span>
                        <span className="status-label">Draft</span>
                    </div>
                    <div className="status-card" style={{ borderColor: getStatusColor('active') }}>
                        <span className="status-number">{summary.active}</span>
                        <span className="status-label">Active</span>
                    </div>
                    <div className="status-card" style={{ borderColor: getStatusColor('completed') }}>
                        <span className="status-number">{summary.completed}</span>
                        <span className="status-label">Completed</span>
                    </div>
                    <div className="status-card" style={{ borderColor: getStatusColor('cancelled') }}>
                        <span className="status-number">{summary.cancelled}</span>
                        <span className="status-label">Cancelled</span>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="no-projects">
                    <p>No projects found.</p>
                    {searchTerm && <p>Try adjusting your search or filters.</p>}
                </div>
            ) : (
                <>
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <div key={project._id} className="project-card">
                                <div className="project-header">
                                    <h3 className="project-title">{project.title}</h3>
                                    <div 
                                        className="status-badge"
                                        style={{ 
                                            backgroundColor: getStatusColor(project.status),
                                            color: 'white'
                                        }}
                                    >
                                        {project.status}
                                    </div>
                                </div>

                                <p className="project-description">
                                    {project.description.length > 150 
                                        ? `${project.description.substring(0, 150)}...` 
                                        : project.description
                                    }
                                </p>

                                <div className="project-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{project.address}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Volunteers:</span>
                                        <span className="detail-value">{project.volunteerCount}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Created:</span>
                                        <span className="detail-value">{formatDate(project.createdAt)}</span>
                                    </div>
                                </div>

                                {project.organization && (
                                    <div className="organization-info">
                                        <div className="org-avatar">
                                            {project.organization.image ? (
                                                <img
                                                    src={project.organization.image}
                                                    alt={project.organization.organizationName}
                                                />
                                            ) : (
                                                <div className="org-placeholder">
                                                    {project.organization.organizationName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="org-details">
                                            <span className="org-name">{project.organization.organizationName}</span>
                                            <span className="org-contact">by {project.organization.name}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="project-actions">
                                    <button className="view-btn">View Details</button>
                                    <button className="join-btn">Join Project</button>
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
        </main>
    );
}