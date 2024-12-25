import { PageContainer } from '@toolpad/core/PageContainer';
import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Info from '../../components/checkout/Info.tsx';
import InfoMobile from '../../components/checkout/InfoMobile.tsx';
import AddressForm from '../../components/checkout/AddressForm.tsx';
import PaymentForm from '../../components/checkout/PaymentForm.tsx';
import Review from '../../components/checkout/Review.tsx';
import { useNavigate } from 'react-router-dom';
import { useOrderService } from '../../hooks/services/useOrderService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm />;
        case 2:
            return <Review />;
        default:
            throw new Error('Unknown step');
    }
}

const OrdersPage = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [serialNumber, setSerialNumber] = React.useState('');
    const [orderPending, setOrderPending] = React.useState(false);

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { orderSmartMeterConnector } = useOrderService();

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handlePlaceOrder = async () => {
        try {
            setOrderPending(true);
            setSerialNumber(await orderSmartMeterConnector());
            setActiveStep(activeStep + 1);
        } catch (error) {
            console.log(error);
            showSnackbar('error', 'Failed to place order');
        } finally {
            setOrderPending(false);
        }
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <PageContainer title={''}>
            <Grid
                container
                sx={{
                    height: {
                        xs: '100%',
                        sm: '100%',
                    },
                    mt: {
                        xs: 4,
                        sm: 0,
                    },
                }}>
                <Grid
                    size={{ xs: 12, sm: 5, lg: 4 }}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRight: { sm: 'none', md: '1px solid' },
                        borderColor: { sm: 'none', md: 'divider' },
                        alignItems: 'start',
                        pt: 8,
                        px: 8,
                        gap: 4,
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: 500,
                        }}>
                        <Info totalPrice={activeStep >= 2 ? '49,98€' : '39,99€'} />
                    </Box>
                </Grid>
                <Grid
                    size={{ sm: 12, md: 7, lg: 8 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: { xs: 'transparent', sm: 'background.default' },
                        alignItems: 'start',
                        pt: { xs: 0, sm: 7 },
                        px: { xs: 2, sm: 10 },
                        gap: { xs: 4, md: 8 },
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { sm: 'space-between', md: 'flex-end' },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                        }}>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                flexGrow: 1,
                            }}>
                            <Stepper id="desktop-stepper" activeStep={activeStep} sx={{ width: '100%', height: 40 }}>
                                {steps.map((label) => (
                                    <Step sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }} key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>
                    <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <div>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected products
                                </Typography>
                                <Typography variant="body1">{activeStep >= 2 ? '49,98€' : '39,99€'}</Typography>
                            </div>
                            <InfoMobile totalPrice={activeStep >= 2 ? '49,98€' : '39,99€'} />
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                            maxHeight: '720px',
                            gap: { xs: 5, md: 'none' },
                        }}>
                        <Stepper
                            id="mobile-stepper"
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{ display: { sm: 'flex', md: 'none' } }}>
                            {steps.map((label) => (
                                <Step
                                    sx={{
                                        ':first-child': { pl: 0 },
                                        ':last-child': { pr: 0 },
                                        '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                                    }}
                                    key={label}>
                                    <StepLabel sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <Stack spacing={2} useFlexGap>
                                <Typography variant="h1">📦</Typography>
                                <Typography variant="h5">Thank you for your order!</Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Your order number is
                                    <strong>&nbsp;#140396</strong>. We have emailed your order confirmation and will
                                    update you once its shipped. The serial number of your Smart Meter is{' '}
                                    <strong>{serialNumber}</strong>.
                                </Typography>
                                <Button
                                    onClick={() => {
                                        navigate('/smart-meters');
                                    }}
                                    variant="contained"
                                    sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}>
                                    Go to my Smart Meters
                                </Button>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                                            alignItems: 'end',
                                            flexGrow: 1,
                                            gap: 1,
                                            pb: { xs: 12, sm: 0 },
                                            mt: { xs: 2, sm: 0 },
                                            mb: '60px',
                                        },
                                        activeStep !== 0
                                            ? { justifyContent: 'space-between' }
                                            : { justifyContent: 'flex-end' },
                                    ]}>
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="text"
                                            sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                            Previous
                                        </Button>
                                    )}
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ display: { xs: 'flex', sm: 'none' } }}>
                                            Previous
                                        </Button>
                                    )}
                                    {activeStep === steps.length - 1 ? (
                                        <LoadingButton
                                            loading={orderPending}
                                            variant="contained"
                                            endIcon={<ChevronRightRoundedIcon />}
                                            onClick={() => {
                                                void handlePlaceOrder();
                                            }}
                                            sx={{ width: { xs: '100%', sm: 'fit-content' } }}>
                                            Place order
                                        </LoadingButton>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            endIcon={<ChevronRightRoundedIcon />}
                                            onClick={handleNext}
                                            sx={{ width: { xs: '100%', sm: 'fit-content' } }}>
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </PageContainer>
    );
};
export default OrdersPage;
