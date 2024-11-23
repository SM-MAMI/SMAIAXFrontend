import { Button, Typography } from '@mui/material';
import SmartMeterIcon from '../../assets/SmartMeterIcon';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import { ReactNode } from 'react';

interface SmartMeterCardProps {
    smartMeterOverview: SmartMeterOverviewDto;
    navigateToDetails: () => void;
    showAddMetadata?: boolean;
    navigateToDetailsWithOpenMetadata: () => void;
    children?: ReactNode;
}

const SmartMeterCard: React.FC<SmartMeterCardProps> = ({
    smartMeterOverview,
    navigateToDetails,
    showAddMetadata,
    navigateToDetailsWithOpenMetadata,
    children,
}: SmartMeterCardProps) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: '1fr 5fr 1fr',
                gridTemplateColumns: '1fr',
                justifyItems: 'center',
                alignItems: 'center',
            }}>
            <Typography variant="h5">{smartMeterOverview.name}</Typography>
            <Button onClick={navigateToDetails}>
                <SmartMeterIcon />
            </Button>
            {showAddMetadata && (
                <Button variant="outlined" color="secondary" onClick={navigateToDetailsWithOpenMetadata}>
                    Add Metadata
                </Button>
            )}
            {children}
        </div>
    );
};

export default SmartMeterCard;
