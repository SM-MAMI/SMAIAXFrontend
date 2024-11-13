import { Breadcrumb, PageContainer, useActivePage } from '@toolpad/core';
import { SmartMeterDto } from '../api/openAPI';
import { useParams } from 'react-router-dom';
import { useSmartMeterService } from '../hooks/services/useSmartMeterService';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import invariant from '../tiny-invariant';
import EditMetadata from '../components/smartMeter/EditMetadata';

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);

    const params = useParams<{ id: string }>();
    const activePage = useActivePage();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();

    invariant(activePage, 'No navigation match');
    const path = `${activePage.path}/${params.id ?? ''}`;

    const title = useMemo<string>(() => {
        return smartMeter?.name ?? 'NOT FOUND';
    }, [smartMeter]);

    const breadcrumbs = useMemo<Breadcrumb[]>(() => {
        return [...activePage.breadcrumbs, { title, path }];
    }, [activePage.breadcrumbs, path, title]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    return (
        <PageContainer title={title} breadcrumbs={breadcrumbs}>
            {smartMeter?.metadata?.map((md) => <EditMetadata metadata={md} key={md.id} />)}
        </PageContainer>
    );
};

export default SmartMeterDetailsPage;
