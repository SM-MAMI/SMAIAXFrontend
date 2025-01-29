import { AxiosError } from 'axios';
import { ProblemDetails } from '../api/openAPI';

export type Order = 'asc' | 'desc';
export type SmartMeterId = string & { readonly __brand: 'SmartMeterId' };
export type PolicyId = string & { readonly __brand: 'PolicyId' };
export type ContractId = string & { readonly __brand: 'ContractId' };

export const getErrorDetails = (axiosError: AxiosError<ProblemDetails>) => {
    const { response, message } = axiosError;
    const { detail, title } = response?.data ?? {};

    return detail || title || message;
};

export const formatToLocalDateTime = (isoTimestamp: string | number) => {
    const localDate = new Date(isoTimestamp);
    return localDate.toLocaleString();
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

export function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
