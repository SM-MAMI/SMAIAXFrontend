import { Button, Typography } from '@mui/material';
import SmartMeterIcon from '../../assets/SmartMeterIcon';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import KebabMenu from '../menus/KebabMenu';

interface SmartMeterCardProps {
    smartMeterOverview: SmartMeterOverviewDto;
    navigateToDetails: () => void;
    showAddMetadata?: boolean;
    navigateToDetailsWithOpenMetadata: () => void;
    kebabItems: Array<{ name: string; onClick: () => void }>;
}

const SmartMeterCard = ({
    smartMeterOverview,
    navigateToDetails,
    showAddMetadata,
    navigateToDetailsWithOpenMetadata,
    kebabItems,
}: SmartMeterCardProps) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: '1fr 5fr 1fr',
                gridTemplateColumns: '1fr 0.25fr',
                justifyItems: 'center',
                alignItems: 'center',
                width: 'fit-content',
            }}>
            <Typography style={{ gridColumn: 1, gridRow: 1 }} variant="h5">
                {smartMeterOverview.name}
            </Typography>
            <div style={{ gridColumn: 2, gridRow: 1 }}>
                <KebabMenu items={kebabItems} />
            </div>
            <Button
                style={{
                    gridColumn: 'span 2',
                    gridRow: 2,
                }}
                onClick={navigateToDetails}>
                <SmartMeterIcon />
            </Button>
            {showAddMetadata && (
                <Button
                    style={{ gridColumn: 'span 2', gridRow: 3 }}
                    variant="outlined"
                    color="secondary"
                    onClick={navigateToDetailsWithOpenMetadata}>
                    Add Metadata
                </Button>
            )}
        </div>
    );
};

export default SmartMeterCard;
