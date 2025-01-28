import {
    DataGrid,
    getGridNumericOperators,
    GridColDef,
    GridFilterInputValue,
    GridFilterItem,
    GridRowParams,
} from '@mui/x-data-grid';
import { formatToLocalDateTime } from '../../utils/helper.ts';
import { ContractOverviewDto, LocationResolution, MeasurementResolution } from '../../api/openAPI';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ContractRow {
    id: string;
    name: string;
    createdAt: string;
    locationResolution: LocationResolution;
    measurementResolution: MeasurementResolution;
    price: number;
    measurementCount: number;
}

const ContractsTable = ({ contracts }: { contracts: ContractOverviewDto[] }) => {
    const navigate = useNavigate();

    const rows: ContractRow[] = contracts.map((contract) => {
        return {
            id: contract.id,
            name: contract.policy.name,
            createdAt: formatToLocalDateTime(contract.createdAt),
            locationResolution: contract.policy.locationResolution,
            measurementResolution: contract.policy.measurementResolution,
            price: contract.policy.price,
            measurementCount: contract.policy.measurementCount,
        } as ContractRow;
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true, filterable: true },
        { field: 'createdAt', headerName: 'Created At', flex: 1, sortable: true, filterable: true },
        {
            field: 'locationResolution',
            headerName: 'Location Resolution',
            flex: 1,
            sortable: true,
            filterable: true,
        },
        {
            field: 'measurementResolution',
            headerName: 'Measurement Resolution',
            flex: 1,
            sortable: true,
            filterable: true,
        },
        {
            field: 'price',
            headerName: 'Price (€)',
            flex: 1,
            sortable: true,
            filterable: true,
            type: 'number',
            filterOperators: [
                ...getGridNumericOperators(),
                {
                    label: 'Smaller than',
                    value: 'smallerThan',
                    getApplyFilterFn: (filterItem: GridFilterItem) => {
                        if (!filterItem.value) {
                            return null;
                        }
                        return (row: { price?: number }) =>
                            row.price !== undefined && row.price < Number(filterItem.value);
                    },
                    InputComponent: GridFilterInputValue,
                },
                {
                    label: 'Greater than',
                    value: 'greaterThan',
                    getApplyFilterFn: (filterItem: GridFilterItem) => {
                        if (!filterItem.value) {
                            return null;
                        }
                        return (row: { price?: number }) =>
                            row.price !== undefined && row.price > Number(filterItem.value);
                    },
                    InputComponent: GridFilterInputValue,
                },
            ],
        },
        {
            field: 'measurementCount',
            headerName: 'Measurement Count',
            flex: 1,
            sortable: true,
            filterable: true,
            type: 'number',
        },
    ];

    return (
        <Box style={{ height: 'calc(100vh - 165px)', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                disableColumnSelector
                onRowClick={(params: GridRowParams<ContractRow>) => {
                    void navigate(params.row.id);
                }}
                sx={{
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                }}
            />
        </Box>
    );
};

export default ContractsTable;
