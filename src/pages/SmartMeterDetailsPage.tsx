import { Breadcrumb, PageContainer, useActivePage } from '@toolpad/core';
import { SmartMeterOverviewDto } from '../api/openAPI';
import { useParams } from 'react-router-dom';
import { useSmartMeterService } from '../hooks/services/useSmartMeterService';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import invariant from '../tiny-invariant';

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterOverviewDto | undefined>(undefined);

    const params = useParams<{ id: string }>();
    const activePage = useActivePage();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();

    invariant(activePage, 'No navigation match');
    const path = `${activePage.path}/${params.id}`;

    const title = useMemo<string>(() => {
        return smartMeter?.name ?? 'NOT FOUND';
    }, [smartMeter]);

    const breadcrumbs = useMemo<Breadcrumb[]>(() => {
        return [...activePage.breadcrumbs, { title, path }];
    }, [activePage, title]);

    useEffect(() => {
        const loadSmartMeter = async () => {
            if (!params.id) {
                throw new Error('Smart meter id not submitted.');
            }
            try {
                const sm = await getSmartMeter(params.id);
                setSmartMeter(sm);
            } catch (error) {
                console.log(error);
                showSnackbar('error', `Failed to load smart meter!`);
            }
        };
        void loadSmartMeter();
    }, []);

    return (
        <PageContainer title={title} breadcrumbs={breadcrumbs}>
            {smartMeter && smartMeter.name}
        </PageContainer>
    );
};

export default SmartMeterDetailsPage;
