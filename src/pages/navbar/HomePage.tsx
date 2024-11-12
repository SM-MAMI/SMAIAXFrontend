import { DialogsProvider, useDialogs } from '@toolpad/core/useDialogs';
import Button from '@mui/material/Button';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';

export default function HomePage() {
    const dialogs = useDialogs();

    async function openDialog() {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    }

    return (
        <DialogsProvider>
            <Button
                onClick={() => {
                    void openDialog();
                }}>
                Open custom
            </Button>
        </DialogsProvider>
    );
}
