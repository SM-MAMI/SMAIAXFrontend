import { PageContainer } from '@toolpad/core/PageContainer';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ContractOverviewDto } from '../../api/openAPI';
import { useContractService } from '../../hooks/services/useContractService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';

const ContractsPage = () => {
    const [contracts, setContracts] = useState<ContractOverviewDto[]>([]);
    const [isContractsCallPending, setIsContractsCallPending] = useState(true);

    const { getContracts } = useContractService();
    const { showSnackbar } = useSnackbar();

    const hasExecutedInitialLoadContracts = useRef(false);
    useEffect(() => {
        if (hasExecutedInitialLoadContracts.current) {
            return;
        }

        void loadContracts();
        hasExecutedInitialLoadContracts.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadContracts = async () => {
        try {
            setIsContractsCallPending(true);
            const contracts = await getContracts();
            setContracts(contracts);
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load contracts!');
        } finally {
            setIsContractsCallPending(false);
        }
    };

    return (
        <PageContainer title={''}>
            {isContractsCallPending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </Box>
            ) : contracts.length <= 0 ? (
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>No contracts available</div>
                </Box>
            ) : (
                <></>
            )}
        </PageContainer>
    );
};

export default ContractsPage;
