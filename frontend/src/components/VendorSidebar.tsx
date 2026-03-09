import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { path: '/vendor/dashboard', label: 'Overview' },
    { path: '/vendor/create-hunt', label: 'New Hunt' },
    { path: '/vendor/analytics', label: 'Analytics' },
];

export function VendorSidebar() {
    const location = useLocation();

    return (
        <div className="vendor-nav">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
