import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import KebabMenu from '../menus/KebabMenu.tsx';

interface CustomSmartMeterCardProps {
    smartMeterOverview: SmartMeterOverviewDto;
    navigateToDetails: () => void;
    kebabItems: Array<{ name: string; onClick: () => void }>;
    isRecentlyAdded: boolean;
}

const SmartMeterCard = ({
    smartMeterOverview,
    navigateToDetails,
    kebabItems,
    isRecentlyAdded,
}: CustomSmartMeterCardProps) => {
    return (
        <Card
            className={isRecentlyAdded ? 'pulse-effect' : ''}
            onClick={navigateToDetails}
            style={{
                width: '100%',
                position: 'relative',
            }}>
            <Box
                sx={{
                    position: 'absolute',
                    paddingTop: '1em',
                    paddingRight: '0.5em',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <KebabMenu items={kebabItems} />
            </Box>
            <CardActionArea>
                <CardHeader title={smartMeterOverview.name} subheader={`ID: ${smartMeterOverview.id}`} />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Metadata count: {smartMeterOverview.metadataCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Policy count: {smartMeterOverview.policyCount}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default SmartMeterCard;
