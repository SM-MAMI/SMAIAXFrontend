import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router-dom';
import { type Navigation } from '@toolpad/core/AppProvider';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { SmaiaxRoutes } from '../constants/constants.ts';

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
