'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Button from '@/components/common/button/Button';

export default function CreateProjectForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    coordinates: [90.4125, 23.8103] // Default to Dhaka
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Project created successfully!');
        setFormData({
          title: '',
          description: '',
          address: '',
          coordinates: [90.4125, 23.8103]
        });
      } else {
        setMessage(data.message || 'Failed to create project');
      }
    } catch (error) {
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!session || session.user?.accountType !== 'organization') {
    return <div>Only organizations can create projects</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Create New Project</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Project Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            placeholder="Describe your project..."
          />
        </div>

        <div>
          <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Project Location *
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="e.g., Dhanmondi, Dhaka, Bangladesh"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="longitude" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              value={formData.coordinates[0]}
              onChange={(e) => setFormData({ 
                ...formData, 
                coordinates: [parseFloat(e.target.value), formData.coordinates[1]] 
              })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="latitude" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              value={formData.coordinates[1]}
              onChange={(e) => setFormData({ 
                ...formData, 
                coordinates: [formData.coordinates[0], parseFloat(e.target.value)] 
              })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '4px',
              backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
              color: message.includes('successfully') ? '#155724' : '#721c24'
            }}
          >
            {message}
          </div>
        )}

        <Button
          variant={loading ? 'loading' : 'primary'}
          label={loading ? 'Creating...' : 'Create Project'}
          type="submit"
          disabled={loading}
          showIcon
        />
      </form>
    </div>
  );
}