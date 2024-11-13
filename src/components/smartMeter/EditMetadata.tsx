import { Box, FormControl, FormLabel, Input } from '@mui/material';
import { MetadataDto } from '../../api/openAPI';

interface EditMetadataProps {
    metadata: MetadataDto;
}

const EditMetadata = ({ metadata }: EditMetadataProps) => {
    return (
        <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="smartMeterName">Household Size</FormLabel>
            </Box>
            <Input
                type="number"
                fullWidth
                id="householdsize"
                name="householdsize"
                value={() => metadata.householdSize ?? 0}
                onChange={(e) => (metadata.householdSize = Number(e.currentTarget.value))}
            />
        </FormControl>
    );
};

export default EditMetadata;
