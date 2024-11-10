import {DialogsProvider, useDialogs} from "@toolpad/core/useDialogs";
import Button from "@mui/material/Button";
import MyCustomDialog from "../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx";

export default function HomePage() {
    const dialogs = useDialogs();
    return <DialogsProvider>
        <Button
            onClick={async () => {
                // preview-start
                await dialogs.open(MyCustomDialog);
                // preview-end
            }}
        >
            Open custom
        </Button>
    </DialogsProvider>;
}
