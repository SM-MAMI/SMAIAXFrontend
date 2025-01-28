import DialogTitle from '@mui/material/DialogTitle';
import CustomDialogActions from '../pure/CustomDialogActions.tsx';
import { Box, Dialog, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import { DialogProps } from '@toolpad/core';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';

interface DeleteSmartMeterDialogPayload {
    reloadSmartMeters: () => void;
    smartMeterId: string;
}

const RemoveSmartMeterDialog = ({ payload, open, onClose }: Readonly<DialogProps<DeleteSmartMeterDialogPayload>>) => {
    const { removeSmartMeter } = useSmartMeterService();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        try {
            await removeSmartMeter(payload.smartMeterId);
            showSnackbar('success', 'Successfully removed smart meter!');
        } catch (error) {
            console.error(error);
        } finally {
            payload.reloadSmartMeters();
            await onClose();
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Remove Smart Meter</DialogTitle>
            <DialogContent>
                <p>Do you really want to remove the smart meter? This action cannot be undone.</p>
            </DialogContent>
            <CustomDialogActions>
                <Box>
                    <Button
                        onClick={() => {
                            void handleSubmit();
                        }}
                        variant="contained">
                        Remove
                    </Button>
                </Box>
                <Button
                    onClick={() => {
                        void onClose();
                    }}
                    variant="outlined">
                    Cancel
                </Button>
            </CustomDialogActions>
        </Dialog>
    );
};

export default RemoveSmartMeterDialog;
