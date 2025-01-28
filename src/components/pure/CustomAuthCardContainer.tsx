import { FC, ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

interface CustomAuthCardContainerProps {
    children: ReactNode;
}

const StyledAuthCardContainer = styled(Stack)(({ theme }) => ({
    margin: 'auto',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const CustomAuthCardContainer: FC<CustomAuthCardContainerProps> = ({ children }) => {
    return (
        <StyledAuthCardContainer direction="column" justifyContent="space-between">
            {children}
        </StyledAuthCardContainer>
    );
};

export default CustomAuthCardContainer;
