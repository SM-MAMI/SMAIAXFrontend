export const EmailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
export const UsernameRegex = /^[a-zA-Z0-9]+$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
export const MediaQueryMobileMaxWidthStr = '(max-width:600px)';
export const MediaQueryTabletMaxWidthStr = '(max-width:900px)';
export const SmaiaxRoutes = {
    HOME: '/',
    ORDERS: 'orders',
    SIGN_IN: 'sign-in',
    SIGN_UP: 'sign-up',
    SMART_METERS: 'smart-meters',
    SMART_METER_DETAILS: 'smart-meters/:id',
    NOT_FOUND: '*',
};
export const SmaiaXAbsoluteRoutes = {
    SIGN_IN: '/' + SmaiaxRoutes.SIGN_IN,
    SIGN_UP: '/' + SmaiaxRoutes.SIGN_UP,
};
