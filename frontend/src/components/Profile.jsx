
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', bio: user.bio || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(null);
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({ name: user.name || '', bio: user.bio || '' });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const config = {
        headers: { 'x-auth-token': token },
      };
      const res = await axios.put(`http://localhost:5000/api/auth/profile`, formData, config);
  setSuccess('Profile updated successfully!');
  setEditMode(false);
  // Update Redux user state and localStorage
  const updatedUser = { ...user, name: formData.name, bio: formData.bio };
  dispatch({ type: 'auth/updateUser', payload: updatedUser });
  localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Please log in to view your profile.</div>;

  return (
    <div className="profile-container" style={{ maxWidth: 420, margin: '2rem auto', padding: '2.5rem', background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', borderRadius: '16px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#888', marginBottom: '1rem' }}>
          {user.name ? user.name.charAt(0).toUpperCase() : <span>U</span>}
        </div>
        <h2 style={{ margin: 0 }}>{user.name}</h2>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
      {editMode ? (
        <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 500 }}>Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', marginTop: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 500 }}>Bio:</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', marginTop: '0.5rem', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={loading} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={handleCancel} style={{ background: '#eee', color: '#333', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}><strong>Bio:</strong> {user.bio || <span style={{ color: '#aaa' }}>No bio provided.</span>}</p>
          <button onClick={handleEdit} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;
