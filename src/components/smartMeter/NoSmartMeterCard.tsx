import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { FC } from 'react';
import { MediaQueryTabletMaxWidthStr } from '../../constants/constants.ts';
import Card from '@mui/material/Card';

interface NoSmartMetersCardProps {
    title: string;
    onBuyClick: () => void;
    onAddClick: () => void;
}

const NoSmartMetersCard: FC<NoSmartMetersCardProps> = ({ title, onBuyClick, onAddClick }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(MediaQueryTabletMaxWidthStr);

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper,
                height: '151px',
                width: isSmallScreen ? '100%' : '50%',
                minWidth: isSmallScreen ? undefined : '532px',
                alignSelf: 'center',
                borderRadius: '8px',
                padding: '1em',
                margin: '1em',
                boxShadow: theme.shadows[1],
            }}>
            <Box>{title}</Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '1em',
                }}>
                <Button onClick={onBuyClick}>👉 Buy One Here 👈</Button>
                <Button onClick={onAddClick}>⚡Add an existing smart meter⚡</Button>
            </Box>
        </Card>
    );
};

export default NoSmartMetersCard;
