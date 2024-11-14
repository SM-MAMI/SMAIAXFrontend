import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Input,
    NativeSelect,
    TextField,
} from '@mui/material';
import { Continent, LocationDto, MetadataCreateDto } from '../../api/openAPI';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService';
import { useMemo, useState } from 'react';
import countryList from 'react-select-country-list';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../hooks/useSnackbar';
import { isNullOrEmptyOrWhiteSpaces } from '../../hooks/useValidation';

interface EditMetadataDialogProps {
    smartMeterId: string;
    isNew: boolean;
    open: boolean;
    onClose: () => void;
}

const EditMetadataDialog = ({ smartMeterId, isNew, open, onClose }: EditMetadataDialogProps) => {
    const [location, setLocation] = useState<LocationDto>({});

    const { addMetadata } = useSmartMeterService();
    const { showSnackbar } = useSnackbar();

    const countryOptions = useMemo(() => {
        return countryList().getData();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const metadataCreate: MetadataCreateDto = {
            householdSize: Number(data.get('householdsize') as string),
            location: location,
            validFrom: new Date(data.get('validfrom') as string).toISOString(),
        };

        //todo: validation

        try {
            await addMetadata(smartMeterId, metadataCreate);

            showSnackbar('success', 'Successfully added metadata!');
        } catch (error) {
            showSnackbar('error', 'Add metadata failed!');
            console.error('Add metadata failed:', error);
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>{isNew ? 'Add Metadata' : 'Edit Metadata'}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={(event) => {
                        void handleSubmit(event);
                    }}
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    <FormControl>
                        <FormLabel htmlFor="householdsize">Household Size</FormLabel>
                        <Input type="number" id="householdsize" name="householdsize" />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="continent">Select a Continent</FormLabel>
                        <NativeSelect
                            inputProps={{
                                name: 'continent',
                                id: 'uncontrolled-native',
                            }}
                            defaultValue="None"
                            onChange={(event: { target: { value: Continent | undefined } }) => {
                                setLocation((prevLocation) => ({ ...prevLocation, continent: event.target.value }));
                            }}>
                            <option aria-label="None" value={undefined} />
                            <option value={Continent.NUMBER_0}>Africa</option>
                            <option value={Continent.NUMBER_1}>Antarctica</option>
                            <option value={Continent.NUMBER_2}>Asia</option>
                            <option value={Continent.NUMBER_3}>Europe</option>
                            <option value={Continent.NUMBER_4}>North America</option>
                            <option value={Continent.NUMBER_5}>Oceania</option>
                            <option value={Continent.NUMBER_6}>South America</option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl disabled={isNullOrEmptyOrWhiteSpaces(location.continent?.toString())}>
                        <FormLabel htmlFor="country">Select a Country</FormLabel>
                        <NativeSelect
                            inputProps={{
                                name: 'country',
                                id: 'uncontrolled-native',
                            }}
                            defaultValue="None"
                            onChange={(event: { target: { value: string | undefined } }) => {
                                setLocation((prevLocation) => ({ ...prevLocation, country: event.target.value }));
                            }}>
                            <option aria-label="None" value={undefined} />
                            {countryOptions.map((co) => (
                                <option key={co.value} value={co.value} label={co.label} />
                            ))}
                        </NativeSelect>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="state">State</FormLabel>
                        <TextField
                            variant="standard"
                            id="state"
                            name="state"
                            disabled={isNullOrEmptyOrWhiteSpaces(location.country)}
                            onChange={(event: { target: { value: string | undefined } }) => {
                                setLocation((prevLocation) => ({ ...prevLocation, state: event.target.value }));
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <TextField
                            variant="standard"
                            id="city"
                            name="city"
                            disabled={isNullOrEmptyOrWhiteSpaces(location.state)}
                            onChange={(event: { target: { value: string | undefined } }) => {
                                setLocation((prevLocation) => ({ ...prevLocation, city: event.target.value }));
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="streetname">Street Name</FormLabel>
                        <TextField
                            variant="standard"
                            id="streetname"
                            name="streetname"
                            disabled={isNullOrEmptyOrWhiteSpaces(location.city)}
                            onChange={(event: { target: { value: string | undefined } }) => {
                                setLocation((prevLocation) => ({ ...prevLocation, streetName: event.target.value }));
                            }}
                        />
                    </FormControl>
                    <DatePicker name="validfrom" label="Valid From" defaultValue={dayjs()} disablePast />
                    <DialogActions>
                        <Button
                            type="submit"
                            onClick={() => {
                                // todo: only close if successful
                                onClose();
                            }}
                            variant="outlined">
                            Ok
                        </Button>
                        <Button
                            onClick={() => {
                                onClose();
                            }}
                            variant="outlined">
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditMetadataDialog;
