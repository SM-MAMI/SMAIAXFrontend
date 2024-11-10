import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router-dom';
import { type Navigation } from '@toolpad/core/AppProvider';
import { AppProvider } from '@toolpad/core/react-router-dom';
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
        segment: 'orders',
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
    {
        segment: 'smart-meters',
        title: 'Smart Meters',
        icon: <ElectricMeter />,
    },
    {
        segment: 'smart-meters/:id',
        title: 'Smart Meter Details',
        pattern: 'smart-meters/:id',
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
