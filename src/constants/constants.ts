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
    POLICY_SEARCH: 'policy-search',
    NOT_FOUND: '*',
};
export const SmaiaXAbsoluteRoutes = {
    SIGN_IN: '/' + SmaiaxRoutes.SIGN_IN,
    SIGN_UP: '/' + SmaiaxRoutes.SIGN_UP,
};
export const VariableLabelMap: Record<string, string> = {
    voltagePhase1: 'Phase 1 Voltage',
    voltagePhase2: 'Phase 2 Voltage',
    voltagePhase3: 'Phase 3 Voltage',
    positiveActivePower: 'Positive Active Power',
    positiveActiveEnergyTotal: 'Positive Active Energy Total',
    negativeActivePower: 'Negative Active Power',
    negativeActiveEnergyTotal: 'Negative Active Energy Total',
    reactiveEnergyQuadrant1Total: 'Reactive Energy Quadrant 1 Total',
    reactiveEnergyQuadrant3Total: 'Reactive Energy Quadrant 3 Total',
    totalPower: 'Total Power',
    currentPhase1: 'Current Phase 1',
    currentPhase2: 'Current Phase 2',
    currentPhase3: 'Current Phase 3',
};
