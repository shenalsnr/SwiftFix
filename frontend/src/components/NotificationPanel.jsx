import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, X, CheckCircle, XCircle, AlertCircle, Info, Ticket, MessageCircle, Wrench, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8080/api';

const TYPE_CONFIG = {
    BOOKING_APPROVED: {
        icon: CheckCircle,
        color: '#22c55e',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        label: 'Booking Approved',
    },
    BOOKING_REJECTED: {
        icon: XCircle,
        color: '#ef4444',
        bg: '#fef2f2',
        border: '#fecaca',
        label: 'Booking Rejected',
    },
    TICKET_CREATED: {
        icon: PlusCircle,
        color: '#8b5cf6',
        bg: '#f5f3ff',
        border: '#ddd6fe',
        label: 'Ticket Submitted',
    },
    TICKET_STATUS_UPDATE: {
        icon: Ticket,
        color: '#0ea5e9',
        bg: '#f0f9ff',
        border: '#bae6fd',
        label: 'Ticket Updated',
    },
    TICKET_RESOLVED: {
        icon: Wrench,
        color: '#10b981',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        label: 'Ticket Resolved',
    },
    TICKET_COMMENT: {
        icon: MessageCircle,
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#fde68a',
        label: 'New Reply',
    },
    SYSTEM_ALERT: {
        icon: AlertCircle,
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#fde68a',
        label: 'Alert',
    },
    DEFAULT: {
        icon: Info,
        color: '#3b82f6',
        bg: '#eff6ff',
        border: '#bfdbfe',
        label: 'Info',
    },
};

function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const NotificationPanel = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const panelRef = useRef(null);

    const userId = user?.userId != null ? String(user.userId) : user?.email;

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/notifications/me?userId=${encodeURIComponent(userId)}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            setError('Unable to load notifications.');
            console.error('Notification fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Fetch on open, and poll every 30 seconds when open
    useEffect(() => {
        if (open) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [open, fetchNotifications]);

    // Close on click outside
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE}/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE}/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.read);
        await Promise.all(unread.map(n => markAsRead(n.id)));
    };

    if (!user) return null;

    return (
        <div ref={panelRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Bell Button */}
            <button
                id="notification-bell"
                onClick={() => setOpen(prev => !prev)}
                style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                }}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        borderRadius: '999px',
                        minWidth: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                        lineHeight: 1,
                        border: '2px solid #0a0f1e',
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '360px',
                    maxHeight: '480px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 9999,
                    animation: 'notif-dropdown 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                    <style>{`
                        @keyframes notif-dropdown {
                            from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                        color: '#fff',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bell size={16} />
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
                            {unreadCount > 0 && (
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '999px',
                                    padding: '2px 8px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                }}>
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    title="Mark all as read"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <CheckCheck size={13} /> All read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                                <div style={{
                                    width: '28px', height: '28px',
                                    border: '3px solid #e2e8f0',
                                    borderTopColor: '#2563eb',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                    margin: '0 auto 12px',
                                }} />
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                <p style={{ fontSize: '0.85rem' }}>Loading notifications...</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div style={{
                                margin: '16px',
                                padding: '12px 16px',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '10px',
                                color: '#b91c1c',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {!loading && !error && notifications.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                <Bell size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                <p style={{ fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>All caught up!</p>
                                <p style={{ fontSize: '0.8rem' }}>No notifications yet.</p>
                            </div>
                        )}

                        {!loading && notifications.map(notif => {
                            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.DEFAULT;
                            const Icon = config.icon;
                            return (
                                <div
                                    key={notif.id}
                                    id={`notification-item-${notif.id}`}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '14px 20px',
                                        borderBottom: '1px solid #f8fafc',
                                        background: notif.read ? '#fff' : '#f0f7ff',
                                        transition: 'background 0.2s',
                                        cursor: 'default',
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '10px',
                                        background: config.bg,
                                        border: `1px solid ${config.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={16} color={config.color} />
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                                            <p style={{
                                                fontSize: '0.82rem',
                                                color: '#1e293b',
                                                lineHeight: 1.5,
                                                fontWeight: notif.read ? 400 : 600,
                                                margin: 0,
                                            }}>
                                                {notif.message}
                                            </p>
                                            {!notif.read && (
                                                <span style={{
                                                    width: '8px', height: '8px',
                                                    background: '#2563eb',
                                                    borderRadius: '50%',
                                                    flexShrink: 0,
                                                    marginTop: '4px',
                                                }} />
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                {timeAgo(notif.createdAt)}
                                            </span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {!notif.read && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        title="Mark as read"
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '3px',
                                                            borderRadius: '5px',
                                                            color: '#3b82f6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <CheckCheck size={13} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notif.id)}
                                                    title="Remove"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '3px',
                                                        borderRadius: '5px',
                                                        color: '#ef4444',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div style={{
                            padding: '10px 20px',
                            borderTop: '1px solid #f1f5f9',
                            textAlign: 'center',
                        }}>
                            <button
                                onClick={() => setNotifications([])}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#94a3b8',
                                    fontSize: '0.75rem',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    margin: '0 auto',
                                }}
                            >
                                <Trash2 size={12} /> Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
