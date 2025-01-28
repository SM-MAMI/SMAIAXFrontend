import { FC, ReactNode } from 'react';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

interface CustomCardProps {
    children: ReactNode;
}

const StyledCard = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '400px',
    height: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    minWidth: '300px',
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const CustomAuthCard: FC<CustomCardProps> = ({ children }) => {
    return <StyledCard variant="outlined">{children}</StyledCard>;
};

export default CustomAuthCard;
