export const EmailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
export const UsernameRegex = /^[a-zA-Z0-9]+$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
export const MobileMaxWidth = 600;
export const MediaQueryMobileMaxWidthStr = `(max-width:${String(MobileMaxWidth)}px)`;
export const TabletMaxWidth = 900;
export const MediaQueryTabletMaxWidthStr = `(max-width:${String(TabletMaxWidth)}px)`;
export const SmaiaxRoutes = {
    HOME: '/',
    ORDERS: 'orders',
    SIGN_IN: 'sign-in',
    SIGN_UP: 'sign-up',
    SMART_METERS: 'smart-meters',
    SMART_METER_DETAILS: 'smart-meters/:id',
    POLICY_SEARCH: 'policy-search',
    NOT_FOUND: '*',
};
export const SmaiaXAbsoluteRoutes = {
    SIGN_IN: '/' + SmaiaxRoutes.SIGN_IN,
    SIGN_UP: '/' + SmaiaxRoutes.SIGN_UP,
};
