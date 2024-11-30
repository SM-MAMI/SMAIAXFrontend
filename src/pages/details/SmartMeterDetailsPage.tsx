import { useActivePage, useDialogs } from '@toolpad/core';
import { SmartMeterDto } from '../../api/openAPI';
import { useLocation, useParams } from 'react-router-dom';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import invariant from '../../tiny-invariant.ts';
import { Box, Button, CircularProgress, Drawer, InputLabel, Select, Typography } from '@mui/material';
import CustomEditMetadataDialog from '../../components/dialogs/CustomEditMetadataDialog.tsx';
import CustomCreatePolicyDialog from '../../components/dialogs/CustomCreatePolicyDialog.tsx';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid2';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedValidFrom, setSelectedValidFrom] = useState<string | undefined>(undefined);

    const params = useParams<{ id: string }>();
    const location = useLocation();
    const activePage = useActivePage();
    const dialogs = useDialogs();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();
    const selectedMetadata = smartMeter?.metadata.find((meta) => meta.validFrom === selectedValidFrom);

    invariant(activePage, 'No navigation match');

    useEffect(() => {
        const loadSmartMeter = async () => {
            if (!params.id) {
                throw new Error('Smart meter id not submitted.');
            }
            try {
                const sm = await getSmartMeter(params.id);
                setSmartMeter(sm);
            } catch (error) {
                console.error(error);
                showSnackbar('error', `Failed to load smart meter!`);
            }
        };
        void loadSmartMeter();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (location.state?.openDialog === true) {
            void openEditMetadataDialog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const openEditMetadataDialog = async () => {
        await dialogs.open(CustomEditMetadataDialog, {
            smartMeterId: smartMeter?.id ?? '',
            isNew: true,
        });
    };

    const openCreatePolicyDialog = async () => {
        await dialogs.open(CustomCreatePolicyDialog, {
            smartMeterId: smartMeter?.id ?? '',
        });
    };

    const openCustomDialogWithDeviceConfiguration = async () => {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    };

    return (
        <>
            {smartMeter == undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            ) : (
                <Box sx={{ display: 'flex', height: '100vh' }}>
                    <Box sx={{ flex: 1, padding: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {smartMeter.name}
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                height: '100%',
                                width: '100%',
                                gap: '10px',
                            }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    void openEditMetadataDialog();
                                }}>
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    void openCustomDialogWithDeviceConfiguration();
                                }}>
                                Device configuration
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    void openCreatePolicyDialog();
                                }}>
                                Create Policy
                            </Button>
                        </div>
                    </Box>

                    <Drawer
                        anchor="right"
                        open={isDrawerOpen}
                        onClose={() => {
                            setIsDrawerOpen(false);
                        }}
                        sx={{
                            '& .MuiDrawer-paper': { width: 600, padding: 2 },
                        }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="h6">Metadata</Typography>
                            <IconButton
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                }}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel id="validFrom-label">Valid From</InputLabel>
                            <Select
                                labelId="validFrom-label"
                                value={selectedValidFrom ?? ''}
                                onChange={(e) => {
                                    setSelectedValidFrom(e.target.value);
                                }}>
                                {smartMeter.metadata.map((meta) => (
                                    <MenuItem key={meta.validFrom} value={meta.validFrom}>
                                        {meta.validFrom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedMetadata ? (
                            <Grid container spacing={2} direction="column" mt={2}>
                                <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Street
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedMetadata.location.streetName ?? 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">{selectedMetadata.location.city ?? 'N/A'}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        State
                                    </Typography>
                                    <Typography variant="body1">{selectedMetadata.location.state ?? 'N/A'}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedMetadata.location.country ?? 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Continent
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedMetadata.location.continent ?? 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Household Size
                                    </Typography>
                                    <Typography variant="body1">{selectedMetadata.householdSize}</Typography>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="body1" color="textSecondary" mt={2}>
                                Select a validFrom to view metadata details.
                            </Typography>
                        )}
                    </Drawer>

                    {!isDrawerOpen && (
                        <IconButton
                            onClick={() => {
                                setIsDrawerOpen(true);
                            }}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: 0,
                                transform: 'translateY(-50%)',
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'primary.dark' },
                            }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                </Box>
            )}
        </>
    );
};

export default SmartMeterDetailsPage;
