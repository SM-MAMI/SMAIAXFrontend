import { Card, CardActionArea, CardContent, CardHeader, Typography, useMediaQuery } from '@mui/material';
import { MediaQueryMaxWidthStr } from '../../constants/constants.ts';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import KebabMenu from '../menus/KebabMenu.tsx';

interface CustomSmartMeterCardProps {
    smartMeterOverview: SmartMeterOverviewDto;
    navigateToDetails: () => void;
    kebabItems: Array<{ name: string; onClick: () => void }>;
    isRecentlyAdded: boolean;
}

const CustomSmartMeterCard = ({
    smartMeterOverview,
    navigateToDetails,
    kebabItems,
    isRecentlyAdded,
}: CustomSmartMeterCardProps) => {
    const isSmallScreen = useMediaQuery(MediaQueryMaxWidthStr);

    return (
        <Card
            className={isRecentlyAdded ? 'pulse-effect' : ''}
            onClick={navigateToDetails}
            style={{
                width: isSmallScreen ? '100%' : '49%',
            }}>
            <CardActionArea>
                <CardHeader
                    action={<KebabMenu items={kebabItems} />}
                    title={smartMeterOverview.name}
                    subheader={`ID: ${smartMeterOverview.id}`}
                />
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

export default CustomSmartMeterCard;
