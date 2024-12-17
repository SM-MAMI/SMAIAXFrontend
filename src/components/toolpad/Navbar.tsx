import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

export default function Navbar() {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}
