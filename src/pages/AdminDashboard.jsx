import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const { user, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [actionLoading, setActionLoading] = useState({});

    // Check if user is admin
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            toast.error('Access denied. Admin only.');
        }
    }, [user, navigate]);

    // Fetch admin data
    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminData();
        }
    }, [user]);

    // Handle showDeleted changes separately
    useEffect(() => {
        if (user?.role === 'admin') {
            console.log('Show deleted changed to:', showDeleted);
            fetchAdminData();
        }
    }, [showDeleted]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            console.log('Fetching admin data from:', backendUrl);
            console.log('Show deleted users:', showDeleted);
            
            // Fetch stats
            const statsResponse = await fetch(`${backendUrl}/api/user/admin/stats`, {
                headers: { token }
            });
            const statsData = await statsResponse.json();
            console.log('Stats response:', statsData);
            
            // Fetch users
            const usersResponse = await fetch(`${backendUrl}/api/user/admin/users?showDeleted=${showDeleted}`, {
                headers: { token }
            });
            const usersData = await usersResponse.json();
            console.log('Users response:', usersData);
            
            if (statsData.success && usersData.success) {
                setStats(statsData);
                setUsers(usersData.users);
                console.log('Data loaded successfully. Users count:', usersData.users.length);
            } else {
                console.error('API Error:', { statsData, usersData });
                if (!statsData.success) toast.error(`Stats error: ${statsData.message}`);
                if (!usersData.success) toast.error(`Users error: ${usersData.message}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch admin data. Check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (action, userId) => {
        // Confirmation for destructive actions
        if (action === 'soft-delete') {
            const confirmed = window.confirm('Are you sure you want to delete this user? This action can be undone.');
            if (!confirmed) return;
        }

        try {
            setActionLoading(prev => ({ ...prev, [userId]: true }));
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/user/admin/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token
                },
                body: JSON.stringify({ userId })
            });
            
            const data = await response.json();
            console.log(`${action} response:`, data);
            
            if (data.success) {
                toast.success(data.message);
                fetchAdminData(); // Refresh data
            } else {
                toast.error(data.message || 'Action failed');
            }
        } catch (error) {
            console.error(`${action} error:`, error);
            toast.error('Action failed. Check network connection.');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setActionLoading(prev => ({ ...prev, [`role-${userId}`]: true }));
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/user/admin/user-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token
                },
                body: JSON.stringify({ userId, role: newRole })
            });
            
            const data = await response.json();
            console.log('Role change response:', data);
            
            if (data.success) {
                toast.success('Role updated successfully');
                fetchAdminData();
            } else {
                toast.error(data.message || 'Failed to update role');
            }
        } catch (error) {
            console.error('Role change error:', error);
            toast.error('Failed to update role. Check network connection.');
        } finally {
            setActionLoading(prev => ({ ...prev, [`role-${userId}`]: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-gray-600 dark:text-gray-400">Loading admin dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage users and view analytics</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Back to App
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'users'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        User Management ({users.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">👥</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Total Users
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats?.totalUsers || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Active Users
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats?.activeUsers || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🗑️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Deleted Users
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats?.deletedUsers || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Growth Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth (Last 6 Months)</h3>
                            <div className="h-64 flex items-end justify-between space-x-2">
                                {stats?.growth?.map((month, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div 
                                            className="bg-blue-500 rounded-t w-full"
                                            style={{ height: `${(month.count / Math.max(...stats.growth.map(m => m.count))) * 200}px` }}
                                        ></div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                            {month.month}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {month.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* User Management Controls */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showDeleted}
                                            onChange={(e) => {
                                                console.log('Checkbox changed to:', e.target.checked);
                                                setShowDeleted(e.target.checked);
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                            Show Deleted Users ({stats?.deletedUsers || 0})
                                        </span>
                                    </label>
                                    <button
                                        onClick={() => {
                                            console.log('Manual refresh clicked');
                                            fetchAdminData();
                                        }}
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {loading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Credits
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                        {showDeleted ? 'No deleted users found' : 'No active users found'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map((user) => (
                                                    <tr key={user._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <img
                                                                        className="h-10 w-10 rounded-full"
                                                                        src={user.profilePicture || '/default-avatar.png'}
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {user.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={user.role || 'user'}
                                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                                disabled={actionLoading[`role-${user._id}`]}
                                                                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                            {actionLoading[`role-${user._id}`] && (
                                                                <span className="ml-2 text-xs text-gray-500">Updating...</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {user.creditBalance || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                user.isDeleted
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            }`}>
                                                                {user.isDeleted ? 'Deleted' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                {user.isDeleted ? (
                                                                    <button
                                                                        onClick={() => handleUserAction('restore-user', user._id)}
                                                                        disabled={actionLoading[user._id]}
                                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                                                                    >
                                                                        {actionLoading[user._id] ? 'Restoring...' : 'Restore'}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUserAction('soft-delete', user._id)}
                                                                        disabled={actionLoading[user._id]}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                                    >
                                                                        {actionLoading[user._id] ? 'Deleting...' : 'Delete'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 