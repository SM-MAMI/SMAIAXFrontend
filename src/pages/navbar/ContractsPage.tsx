import { PageContainer } from '@toolpad/core/PageContainer';
import { Box, CircularProgress, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ContractOverviewDto } from '../../api/openAPI';
import { useContractService } from '../../hooks/services/useContractService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import Grid from '@mui/material/Grid2';
import { MediaQueryTabletMaxWidthStr } from '../../constants/constants.ts';
import ContractsTable from '../../components/tables/ContractsTable.tsx';

const ContractsPage = () => {
    const [contracts, setContracts] = useState<ContractOverviewDto[]>([]);
    const [isContractsCallPending, setIsContractsCallPending] = useState(true);

    const { getContracts } = useContractService();
    const { showSnackbar } = useSnackbar();
    const isSmallScreen = useMediaQuery(MediaQueryTabletMaxWidthStr);

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
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                    <Box sx={{ padding: '1em' }}>
                        <Grid
                            container
                            spacing={2}
                            justifyContent="flex-start"
                            alignItems="center"
                            sx={{ width: '100%' }}
                            component="div">
                            <ContractsTable contracts={contracts} />
                        </Grid>
                    </Box>
                </Box>
            )}
        </PageContainer>
    );
};

export default ContractsPage;
