import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';

export default function Profile() {
    const { user, token, login } = useAuth();
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', bio: '', tags: [] });
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('published');
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (!user) return;

        setForm({ 
            username: user.username || '', 
            email: user.email || '',
            bio: user.bio || 'Home Chef and Food Enthusiast | Sharing My Favorite Recipe and Cooking Tips | Making Cooking Easier For Everyone',
            tags: user.tags || ['Italian Cuisine', 'Baking', 'Healthy']
        });

        const fetchRecipes = async () => {
            try {
                const res = await fetch(`/recipes/user/${user.id}`);
                if (!res.ok) throw new Error('Failed to fetch recipes');
                const data = await res.json();
                setRecipes(data);
            } catch (err) {
                console.error('Error fetching recipes:', err);
                setRecipes([]);
            }
        };

        const fetchFavorites = async () => {
            try {
                const res = await fetch(`/favorites/api/${user.id}`);
                if (!res.ok) throw new Error('Failed to fetch favorites');
                const data = await res.json();
                setFavorites(data);
            } catch (err) {
                console.error('Error fetching favorites:', err);
                setFavorites([]);
            }
        };

        fetchRecipes();
        fetchFavorites();
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('Sending update with data:', form);
            
            const res = await fetch('/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            
            const data = await res.json();
            
            console.log('Response status:', res.status);
            console.log('Response data:', data);
            
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }
            
            console.log('Updating context with:', data.user);
            login(data.user, token);
            
            setMsg('Profile updated successfully!');
            setEdit(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Update error:', err);
            setMsg(err.message || 'Failed to update profile');
            setTimeout(() => setMsg(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim()) && form.tags.length < 5) {
            setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/recipes/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to delete');

            setRecipes(recipes.filter(r => r._id !== id));
            setMsg('Recipe deleted successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg(err.message);
            setTimeout(() => setMsg(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (recipeId) => {
        try {
            const res = await fetch(`/favorites/api/${user.id}/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to remove favorite');

            setFavorites(favorites.filter(f => f._id !== recipeId));
            setMsg('Removed from favorites!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Error removing favorite:', err);
            setMsg('Failed to remove favorite');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    if (!user) {
        return (
            <>
                <NavBar />
                <div className="profile-container">
                    <div style={{ textAlign: 'center', color: '#666' }}>
                        <p>Loading profile...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="new-profile-container">
                {/* Profile Header Section */}
                <div className="profile-banner">
                    <div className="profile-main-info">
                        <div className="profile-avatar-large">
                            {form.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-identity">
                            <h1>{form.username}</h1>
                            <p className="profile-handle">@{form.email.toLowerCase().replace(/\s/g, '')}</p>
                        </div>
                    </div>

                    {!edit && (
                        <button className="edit-profile-btn" onClick={() => setEdit(true)}>
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Bio Section */}
                {!edit ? (
                    <div className="profile-bio">
                        <p>{form.bio}</p>
                        <div className="profile-tags">
                            {form.tags.map((tag, idx) => (
                                <span key={idx} className="profile-tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="profile-edit-section">
                        {msg && <div className={msg.includes('success') ? 'success-msg' : 'error-msg'}>{msg}</div>}
                        <div className="profile-edit-form-inline">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    maxLength={30}
                                    required
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    maxLength={50}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    maxLength={200}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                />
                                <small>{form.bio.length}/200 characters</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tags">Tags (Max 5)</label>
                                <div className="tags-input-container">
                                    <div className="tags-display">
                                        {form.tags.map((tag, idx) => (
                                            <span key={idx} className="tag-edit">
                                                {tag}
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="tag-remove"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    {form.tags.length < 5 && (
                                        <div className="tag-input-wrapper">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={handleTagKeyPress}
                                                placeholder="Add a tag..."
                                                maxLength={20}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddTag}
                                                className="btn-add-tag"
                                                disabled={!tagInput.trim()}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <small>{form.tags.length}/5 tags</small>
                            </div>

                            <div className="inline-actions">
                                <button 
                                    type="button" 
                                    onClick={handleUpdate} 
                                    className="btn-save"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-cancel" 
                                    onClick={() => {
                                        setEdit(false);
                                        setMsg('');
                                        setForm({
                                            username: user.username,
                                            email: user.email,
                                            bio: user.bio,
                                            tags: user.tags
                                        });
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Section - Now shows actual favorites count */}
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <div className="stat-label">Recipes</div>
                            <div className="stat-value">{recipes.length}</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <div className="stat-label">Followers</div>
                            <div className="stat-value">500</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">❤️</div>
                        <div className="stat-content">
                            <div className="stat-label">Favorites</div>
                            <div className="stat-value">{favorites.length}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section - Added Favorites tab */}
                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
                        onClick={() => setActiveTab('published')}
                    >
                        My Recipes
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        Favorites
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('drafts')}
                    >
                        Drafts
                    </button>
                </div>

                {/* Recipes/Favorites Grid */}
                <div className="profile-recipes-grid">
                    {activeTab === 'published' && (
                        <>
                            {recipes.length === 0 ? (
                                <div className="empty-recipes">
                                    <div className="empty-icon">🍳</div>
                                    <p className="empty-title">No recipes yet</p>
                                    <p className="empty-subtitle">Start sharing your culinary creations!</p>
                                </div>
                            ) : (
                                recipes.map(r => (
                                    <div key={r._id} className="recipe-card-wrapper">
                                        <RecipeCard recipe={r} />
                                        <button
                                            className="recipe-delete-btn"
                                            onClick={() => handleDelete(r._id)}
                                            disabled={loading}
                                            title="Delete recipe"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'favorites' && (
                        <>
                            {favorites.length === 0 ? (
                                <div className="empty-recipes">
                                    <div className="empty-icon">❤️</div>
                                    <p className="empty-title">No favorites yet</p>
                                    <p className="empty-subtitle">Start saving recipes you love!</p>
                                </div>
                            ) : (
                                favorites.map(r => (
                                    <div key={r._id} className="recipe-card-wrapper">
                                        <RecipeCard recipe={r} />
                                        <button
                                            className="recipe-delete-btn recipe-unfavorite-btn"
                                            onClick={() => handleRemoveFavorite(r._id)}
                                            disabled={loading}
                                            title="Remove from favorites"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'drafts' && (
                        <div className="empty-recipes">
                            <div className="empty-icon">📄</div>
                            <p className="empty-title">No drafts</p>
                            <p className="empty-subtitle">Draft recipes will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}