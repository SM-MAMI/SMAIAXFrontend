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
import { ContractOverviewDto } from '../../api/openAPI';
import { formatToLocalDateTime, getComparator, Order } from '../../utils/helper.ts';
import { useNavigate } from 'react-router-dom';

const ContractsTable = ({ contracts }: { contracts: ContractOverviewDto[] }) => {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const navigate = useNavigate();

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowClick = (contract: ContractOverviewDto) => {
        void navigate(contract.id);
    };

    // noinspection TypeScriptValidateTypes
    // @ts-expect-error doesnt matter
    const sortedContracts = contracts.slice().sort(getComparator(order, orderBy));

    return (
        <TableContainer component={Paper} sx={{ height: 'calc(100vh - 165px)', overflow: 'auto' }}>
            <Table stickyHeader>
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
                                active={orderBy === 'createdAt'}
                                direction={orderBy === 'createdAt' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('createdAt');
                                }}>
                                Created at
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
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'price'}
                                direction={orderBy === 'price' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('price');
                                }}>
                                Price
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'measurementCount'}
                                direction={orderBy === 'measurementCount' ? order : 'asc'}
                                onClick={() => {
                                    handleRequestSort('measurementCount');
                                }}>
                                Measurmemt Count
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedContracts.length > 0 ? (
                        sortedContracts.map((contract) => (
                            <TableRow
                                key={contract.id}
                                hover
                                onClick={() => {
                                    handleRowClick(contract);
                                }}
                                sx={{
                                    cursor: 'pointer',
                                }}>
                                <TableCell>{contract.policy.name}</TableCell>
                                <TableCell>{formatToLocalDateTime(contract.createdAt)}</TableCell>
                                <TableCell>{contract.policy.locationResolution}</TableCell>
                                <TableCell>{contract.policy.measurementResolution}</TableCell>
                                <TableCell>{contract.policy.price}</TableCell>
                                <TableCell>{contract.policy.measurementCount}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography variant="body1">No contract found.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ContractsTable;
