import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navigation, Session } from '@toolpad/core';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { MediaQueryMobileMaxWidthStr, SmaiaXAbsoluteRoutes, SmaiaxRoutes } from '../../../constants/constants.ts';
import { Description, ElectricMeter, Search } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useAuthenticationService } from '../../../hooks/services/useAuthenticationService.ts';
import { TokenDto } from '../../../api/openAPI';
import { SmaiaxLogo } from '../../../assets/SmaiaxLogo.tsx';
import Typography from '@mui/material/Typography';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { createTheme } from '@mui/material/styles';
import { colorSchemes, shadows, shape, typography } from '../../../themes/themePrimitives.ts';
import { useMediaQuery } from '@mui/material';

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
        kind: 'divider',
    },
    {
        segment: SmaiaxRoutes.POLICY_SEARCH,
        title: 'Data Search',
        icon: <Search />,
    },
    {
        segment: SmaiaxRoutes.CONTRACTS,
        title: 'Contracts',
        pattern: `${SmaiaxRoutes.CONTRACTS}{/:id}*`,
        icon: <Description />,
    },
    {
        kind: 'divider',
    },
    {
        segment: SmaiaxRoutes.SMART_METERS,
        title: 'Smart Meters',
        pattern: `${SmaiaxRoutes.SMART_METERS}{/:id}*`,
        icon: <ElectricMeter />,
    },
    {
        segment: SmaiaxRoutes.ORDERS,
        title: 'Order Connector',
        icon: <ShoppingCartIcon />,
    },
];

const BRANDING = {
    title: (
        <Typography
            sx={{
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: 18,
                color: '#33bde4',
            }}>
            S M A I A - X
        </Typography>
    ),
    logo: SmaiaxLogo(),
};

const BRANDING_SMALL = {
    title: '',
    logo: SmaiaxLogo(),
};

const customTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes,
    typography,
    shadows,
    shape,
});

const NavbarNavigation = () => {
    const [session, setSession] = useState<Session | null>();

    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(MediaQueryMobileMaxWidthStr);
    const { logout } = useAuthenticationService();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            void navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
            return;
        }

        try {
            const decodedAccessToken = jwtDecode<JwtPayload & { unique_name: string; email: string }>(accessToken);
            const { sub, unique_name, email } = decodedAccessToken;

            setSession({ user: { id: sub, name: unique_name, email } });
        } catch (error) {
            console.error(error);
            void navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
        }
    }, [navigate]);

    const authentication = useMemo(() => {
        // noinspection JSUnusedGlobalSymbols
        return {
            signIn: () => {},
            signOut: () => {
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');

                if (!accessToken || !refreshToken) {
                    void navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
                    return;
                }

                const tokenDto: TokenDto = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };

                void logout(tokenDto);

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                void navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
            },
        };
    }, [logout, navigate]);

    return (
        <ReactRouterAppProvider
            navigation={NAVIGATION}
            // @ts-expect-error - Needed for custom typography in branding
            branding={isSmallScreen ? BRANDING_SMALL : BRANDING}
            authentication={authentication}
            theme={customTheme}
            session={session}>
            <Outlet />
        </ReactRouterAppProvider>
    );
};

export default NavbarNavigation;
