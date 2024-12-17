import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet, useNavigate } from 'react-router-dom';
import { type Navigation, Session } from '@toolpad/core/AppProvider';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { MediaQueryMaxWidthStr, SmaiaXAbsoluteRoutes, SmaiaxRoutes } from '../constants/constants.ts';
import { ElectricMeter } from '@mui/icons-material';
import React from 'react';
import { useAuthenticationService } from '../hooks/services/useAuthenticationService.ts';
import { TokenDto } from '../api/openAPI';
import { SmaiaxLogo } from '../assets/SmaiaxLogo.tsx';
import Typography from '@mui/material/Typography';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { createTheme } from '@mui/material/styles';
import { colorSchemes, shadows, shape, typography } from '../themes/themePrimitives.ts';
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
        segment: SmaiaxRoutes.ORDERS,
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
    {
        segment: SmaiaxRoutes.SMART_METERS,
        title: 'Smart Meters',
        pattern: 'smart-meters{/:id}*',
        icon: <ElectricMeter />,
    },
];

const BRANDING = {
    title: (
        <Typography
            sx={{
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: 18,
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
    const navigate = useNavigate();

    const { logout, refresh } = useAuthenticationService();

    const [session, setSession] = React.useState<Session | null>();

    const isSmallScreen = useMediaQuery(MediaQueryMaxWidthStr);

    React.useEffect(() => {
        const fetchSession = async () => {
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (!accessToken || !refreshToken) {
                navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
                return;
            }

            try {
                const decodedAccessToken = jwtDecode<JwtPayload & { unique_name: string; email: string }>(accessToken);
                const { sub, unique_name, email, exp } = decodedAccessToken;

                if (!exp) {
                    navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
                    return;
                } else if (exp < Date.now()) {
                    const newTokens = await refresh({ accessToken, refreshToken });
                    localStorage.setItem('access_token', newTokens.accessToken);
                    localStorage.setItem('refresh_token', newTokens.refreshToken);

                    const decodedNewAccessToken = jwtDecode<JwtPayload & { unique_name: string; email: string }>(
                        newTokens.accessToken
                    );
                    setSession({
                        user: {
                            id: decodedNewAccessToken.sub,
                            name: decodedNewAccessToken.unique_name,
                            email: decodedNewAccessToken.email,
                        },
                    });
                } else {
                    setSession({ user: { id: sub, name: unique_name, email } });
                }
            } catch (error) {
                console.error(error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
            }
        };

        void fetchSession();
    }, [navigate, refresh]);

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {},
            signOut: () => {
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');

                if (!accessToken || !refreshToken) {
                    navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
                    return;
                }

                const tokenDto: TokenDto = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };

                void logout(tokenDto);

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
            },
        };
    }, [logout, navigate]);

    return (
        <AppProvider
            navigation={NAVIGATION}
            // @ts-expect-error - Needed for custom typography in branding
            branding={isSmallScreen ? BRANDING_SMALL : BRANDING}
            authentication={authentication}
            theme={customTheme}
            session={session}>
            <Outlet />
        </AppProvider>
    );
};

export default NavbarNavigation;
