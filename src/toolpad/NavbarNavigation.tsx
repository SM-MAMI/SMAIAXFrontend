import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router-dom';
import { type Navigation } from '@toolpad/core/AppProvider';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { SmaiaxRoutes } from '../constants/constants.ts';
import { ElectricMeter, Segment } from '@mui/icons-material';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        title: 'Home',
        icon: <DashboardIcon />,
    },
    {
        segment: SmaiaxRoutes.ORDERS,
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
    {
        segment: SmaiaxRoutes.SMART_METERS,
        title: 'Smart Meters',
        icon: <ElectricMeter />,
    },
    {
        segment: SmaiaxRoutes.SMART_METER_DETAILS,
        title: 'Smart Meter Details',
        pattern: SmaiaxRoutes.SMART_METER_DETAILS,
        icon: <Segment />,
    },
];

const BRANDING = {
    title: 'My Toolpad Core App',
};

const NavbarNavigation = () => {
    return (
        <AppProvider navigation={NAVIGATION} branding={BRANDING}>
            <Outlet />
        </AppProvider>
    );
};

export default NavbarNavigation;
