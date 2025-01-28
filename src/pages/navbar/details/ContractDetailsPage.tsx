import { PageContainer } from '@toolpad/core/PageContainer';
import { ActivePage, Breadcrumb, useActivePage } from '@toolpad/core';
import { ContractDto } from '../../../api/openAPI';
import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../../hooks/useSnackbar.ts';
import { useContractService } from '../../../hooks/services/useContractService.ts';
import { useParams } from 'react-router-dom';

const generateBreadcrumbs = (contract: ContractDto | undefined, activePage: ActivePage | null): Breadcrumb[] => {
    const previousBreadcrumbs = activePage?.breadcrumbs ?? [];
    return contract && activePage
        ? [
              ...previousBreadcrumbs,
              {
                  title: contract.policy.name,
                  path: `${activePage.path}/${contract.id}`,
              },
          ]
        : previousBreadcrumbs;
};

const ContractDetailsPage = () => {
    const [contract, setContract] = useState<ContractDto | undefined>(undefined);
    const [isContractCallPending, setIsContractCallPending] = useState(true);

    const params = useParams<{ id: string }>();
    const activePage = useActivePage();
    const { showSnackbar } = useSnackbar();
    const { getContract } = useContractService();

    const breadcrumbs = generateBreadcrumbs(contract, activePage);

    const hasExecutedInitialLoadContract = useRef(false);
    useEffect(() => {
        if (!hasExecutedInitialLoadContract.current) {
            void loadContract();
            hasExecutedInitialLoadContract.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const loadContract = async () => {
        if (!params.id) {
            throw new Error('Contract id not submitted.');
        }
        try {
            setIsContractCallPending(true);
            const contract = await getContract(params.id);
            setContract(contract);
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load Contract!');
        } finally {
            setIsContractCallPending(false);
        }
    };

    return (
        <PageContainer title={''} breadcrumbs={breadcrumbs}>
            {isContractCallPending ? (
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </Box>
            ) : contract === undefined ? (
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>No contract details available</div>
                </Box>
            ) : (
                <></>
            )}
        </PageContainer>
    );
};

export default ContractDetailsPage;
