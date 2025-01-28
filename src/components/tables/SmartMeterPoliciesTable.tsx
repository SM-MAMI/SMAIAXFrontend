import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { PolicyDto } from '../../api/openAPI';
import Button from '@mui/material/Button';
import { getComparator, Order } from '../../utils/helper.ts';

const SmartMeterPoliciesTable = ({
    policies,
    onPurchase,
}: {
    policies: PolicyDto[];
    onPurchase?: (policyId: string) => void;
}) => {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof PolicyDto>('name');

    const handleRequestSort = (property: keyof PolicyDto) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedPolicies = policies.slice().sort(getComparator(order, orderBy));

    return (
        <TableContainer
            component={Paper}
            style={{
                maxHeight: onPurchase ? 'calc(100vh - 500px)' : '450px',
                minHeight: onPurchase ? '300px' : '',
            }}>
            <Table stickyHeader size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('name');
                                }}>
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'locationResolution'}
                                direction={orderBy === 'locationResolution' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('locationResolution');
                                }}>
                                Location Resolution
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'measurementResolution'}
                                direction={orderBy === 'measurementResolution' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('measurementResolution');
                                }}>
                                Measurement Resolution
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align={'right'}>
                            <TableSortLabel
                                active={orderBy === 'price'}
                                direction={orderBy === 'price' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('price');
                                }}>
                                Price (€)
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align={'right'}>
                            <TableSortLabel
                                active={orderBy === 'measurementCount'}
                                direction={orderBy === 'measurementCount' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('measurementCount');
                                }}>
                                Measurement Count
                            </TableSortLabel>
                        </TableCell>
                        {onPurchase && <TableCell align={'right'}></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedPolicies.length > 0 ? (
                        sortedPolicies.map((policy) => (
                            <TableRow key={policy.id}>
                                <TableCell>{policy.name}</TableCell>
                                <TableCell>{policy.locationResolution}</TableCell>
                                <TableCell>{policy.measurementResolution}</TableCell>
                                <TableCell align={'right'}>{policy.price}</TableCell>
                                <TableCell align={'right'}>{policy.measurementCount}</TableCell>
                                {onPurchase && (
                                    <TableCell align={'right'}>
                                        <Button
                                            variant={'outlined'}
                                            onClick={() => {
                                                onPurchase(policy.id);
                                            }}>
                                            Purchase
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={onPurchase ? 6 : 5} align="center">
                                <Typography variant="body1">No policies found.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SmartMeterPoliciesTable;
