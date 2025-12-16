import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function Search() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followingIds, setFollowingIds] = useState([]);
    const [msg, setMsg] = useState('');

    // Fetch current user's following list
    useEffect(() => {
        const fetchFollowing = async () => {
            if (!user?.id) return;
            
            try {
                const res = await fetch('/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setFollowingIds(data.following || []);
                }
            } catch (err) {
                console.error('Error fetching following:', err);
            }
        };

        fetchFollowing();
    }, [user, token]);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/users/search?q=${encodeURIComponent(searchQuery)}`);
            
            if (!res.ok) throw new Error('Search failed');
            
            const data = await res.json();
            // Filter out current user from results
            const filteredUsers = data.filter(u => u._id !== user?.id);
            setUsers(filteredUsers);
        } catch (err) {
            console.error('Search error:', err);
            setMsg('Failed to search users');
            setTimeout(() => setMsg(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        if (!user) {
            setMsg('Please login to follow users');
            setTimeout(() => setMsg(''), 3000);
            return;
        }

        try {
            const res = await fetch(`/users/${userId}/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to follow user');

            setFollowingIds([...followingIds, userId]);
            setMsg('Successfully followed user!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Follow error:', err);
            setMsg(err.message || 'Failed to follow user');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            const res = await fetch(`/users/${userId}/follow`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to unfollow user');

            setFollowingIds(followingIds.filter(id => id !== userId));
            setMsg('Unfollowed user');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Unfollow error:', err);
            setMsg(err.message || 'Failed to unfollow user');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const isFollowing = (userId) => {
        return followingIds.includes(userId);
    };

    return (
        <>
            <NavBar />
            <div className="search-users-container">
                <div className="search-header">
                    <h2>Discover Chefs</h2>
                    <p className="search-subtitle">Find and follow other home chefs sharing their recipes</p>
                </div>

                {msg && (
                    <div className={msg.includes('success') || msg.includes('Successfully') ? 'success-msg' : 'error-msg'}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by username, bio, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input-field"
                        />
                    </div>
                    <button type="submit" className="search-submit-btn" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div className="users-results">
                    {users.length === 0 && searchQuery && !loading && (
                        <div className="empty-results">
                            <div className="empty-icon">🔍</div>
                            <p className="empty-title">No users found</p>
                            <p className="empty-subtitle">Try searching with different keywords</p>
                        </div>
                    )}

                    {users.length === 0 && !searchQuery && (
                        <div className="empty-results">
                            <div className="empty-icon">👥</div>
                            <p className="empty-title">Start searching</p>
                            <p className="empty-subtitle">Enter a username, bio keyword, or tag to find chefs</p>
                        </div>
                    )}

                    {users.map(searchUser => (
                        <div key={searchUser._id} className="user-result-card">
                            <div 
                                className="user-info" 
                                onClick={() => navigate(`/users/${searchUser._id}`)}
                                style={{ cursor: 'pointer', flex: 1 }}
                            >
                                <div className="user-avatar">
                                    {searchUser.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-details">
                                    <h3 className="user-name">{searchUser.username}</h3>
                                    <p className="user-bio">{searchUser.bio}</p>
                                    {searchUser.tags && searchUser.tags.length > 0 && (
                                        <div className="user-tags">
                                            {searchUser.tags.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className="user-tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="user-stats-mini">
                                        <span>👥 {searchUser.followers?.length || 0} followers</span>
                                        <span>📝 {searchUser.following?.length || 0} following</span>
                                    </div>
                                </div>
                            </div>
                            
                            {user && (
                                <button
                                    className={`follow-btn ${isFollowing(searchUser._id) ? 'following' : ''}`}
                                    onClick={() => isFollowing(searchUser._id) ? handleUnfollow(searchUser._id) : handleFollow(searchUser._id)}
                                >
                                    {isFollowing(searchUser._id) ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}