import { Typography } from '@mui/material';
import ColorModeSelect from '../themes/ColorModeSelect.tsx';

const HomePage = () => {
    return (
        <>
            <Typography>Home Page</Typography>
            <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
        </>
    );
};

export default HomePage;