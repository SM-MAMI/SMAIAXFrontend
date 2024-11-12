import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet, useNavigate } from 'react-router-dom';
import { type Navigation, Session } from '@toolpad/core/AppProvider';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { SmaiaxRoutes } from '../constants/constants.ts';
import React from 'react';
import { useAuthenticationService } from '../hooks/services/useAuthenticationService.ts';
import { TokenDto } from '../api/openAPI';
import { useUserService } from '../hooks/services/useUserService.ts';
import { useSnackbar } from '../hooks/useSnackbar.ts';

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
    title: 'S M A I A - X',
};

const NavbarNavigation = () => {
    const navigate = useNavigate();

    const { showSnackbar } = useSnackbar();

    const { logout } = useAuthenticationService();

    const { getUser } = useUserService();

    const [session, setSession] = React.useState<Session | null>({
        user: {
            name: 'Guest',
            email: '',
            image: '',
        },
    });

    React.useEffect(() => {
        getUser()
            .then((user) => {
                const firstName = user.name?.firstName ?? 'N/A';
                const lastName = user.name?.lastName ?? 'N/A';

                setSession({
                    user: {
                        name: `${firstName} ${lastName}`,
                        email: user.email,
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            })
            .catch(() => {
                showSnackbar('error', 'Get user information failed!');
            });
    }, [getUser, showSnackbar]);

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {},
            signOut: () => {
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');

                if (!accessToken || !refreshToken) {
                    navigate(SmaiaxRoutes.SIGN_IN);
                    return;
                }

                const tokenDto: TokenDto = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };

                void logout(tokenDto);

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                navigate(SmaiaxRoutes.SIGN_IN);
            },
        };
    }, [logout, navigate]);

    return (
        <AppProvider navigation={NAVIGATION} branding={BRANDING} authentication={authentication} session={session}>
            <Outlet />
        </AppProvider>
    );
};

export default NavbarNavigation;
