import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarCheck,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
} from 'lucide-react';
import AdminDashboard from './Adminbooking';

const NAV_ITEMS = [
    {
        label: 'Booking Management',
        icon: CalendarCheck,
        path: '.',   // relative to /admin
        end: true,
    },
    // ➕ Add more admin sections here in the future
];

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarW = collapsed ? '72px' : '240px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* ── Mobile overlay ── */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 40,
                    }}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                style={{
                    width: sidebarW,
                    minHeight: '100vh',
                    background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.25s ease',
                    position: 'fixed',
                    top: 0, left: 0, bottom: 0,
                    zIndex: 50,
                    boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
                    overflowX: 'hidden',
                }}
            >
                {/* Logo / Brand */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10, padding: '22px 18px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    minHeight: 72,
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.12)',
                        borderRadius: 10, padding: 8,
                        display: 'flex', flexShrink: 0,
                    }}>
                        <ShieldCheck size={22} color="#a5b4fc" />
                    </div>
                    {!collapsed && (
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{
                                color: '#fff', fontWeight: 800,
                                fontSize: 16, letterSpacing: '-0.3px',
                                whiteSpace: 'nowrap',
                            }}>
                                SwiftFix
                            </div>
                            <div style={{
                                color: '#a5b4fc', fontSize: 10,
                                fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}>
                                Admin Portal
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav label */}
                {!collapsed && (
                    <div style={{
                        padding: '14px 18px 6px',
                        color: 'rgba(165,180,252,0.55)',
                        fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                        Management
                    </div>
                )}

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '4px 10px', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(({ label, icon: Icon, path, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center',
                                gap: 12, padding: '11px 10px',
                                borderRadius: 10, marginBottom: 4,
                                textDecoration: 'none',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: 14,
                                color: isActive ? '#fff' : 'rgba(199,210,254,0.75)',
                                background: isActive
                                    ? 'rgba(255,255,255,0.14)'
                                    : 'transparent',
                                boxShadow: isActive
                                    ? 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                                    : 'none',
                                transition: 'all 0.18s ease',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={18}
                                        color={isActive ? '#a5b4fc' : 'rgba(165,180,252,0.6)'}
                                        style={{ flexShrink: 0 }}
                                    />
                                    {!collapsed && <span>{label}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    style={{
                        margin: '8px 10px 16px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-end',
                        gap: 8, padding: '10px 10px',
                        borderRadius: 10, border: 'none',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(165,180,252,0.7)',
                        cursor: 'pointer', fontSize: 12,
                        fontWeight: 600, letterSpacing: '0.04em',
                        transition: 'background 0.18s',
                        width: collapsed ? 'calc(100% - 20px)' : 'auto',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                    {collapsed ? <ChevronRight size={16} /> : (
                        <>
                            <span>Collapse</span>
                            <ChevronLeft size={16} />
                        </>
                    )}
                </button>
            </aside>

            {/* ── Main content area ── */}
            <div style={{
                marginLeft: sidebarW,
                flex: 1,
                transition: 'margin-left 0.25s ease',
                display: 'flex', flexDirection: 'column',
                minWidth: 0,
            }}>
                {/* Top header bar */}
                <header style={{
                    background: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0 28px',
                    height: 64,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 30,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <LayoutDashboard size={20} color="#6366f1" />
                        <span style={{
                            fontWeight: 700, fontSize: 18,
                            color: '#1e293b', letterSpacing: '-0.2px',
                        }}>
                            Admin Dashboard
                        </span>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: '#fff',
                            fontSize: 11, fontWeight: 700,
                            padding: '4px 12px', borderRadius: 20,
                            letterSpacing: '0.05em', textTransform: 'uppercase',
                        }}>
                            Admin
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        {/* ➕ Add more admin routes here */}
                    </Routes>
                </main>

                {/* Footer */}
                <footer style={{
                    textAlign: 'center', padding: '14px',
                    fontSize: 11, color: '#94a3b8',
                    borderTop: '1px solid #e2e8f0', background: '#fff',
                }}>
                    SwiftFix Admin Portal &bull; &copy; 2026 SwiftFix. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
