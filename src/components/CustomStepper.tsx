import React from 'react';
import { Box, Button, Step, StepContent, StepLabel, Stepper } from '@mui/material';

export interface StepItem {
    title: string;
    content: React.ReactNode;
}

interface CustomStepperProps {
    steps: StepItem[];
    orientation: 'horizontal' | 'vertical';
    activeStep: number;
    onNext?: () => void;
    onBack?: () => void;
    onFinish?: () => void;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ steps, orientation, activeStep, onNext, onBack, onFinish }) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stepper activeStep={activeStep} orientation={orientation}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step.title}</StepLabel>
                        {orientation === 'vertical' && (
                            <StepContent>
                                <Box sx={{ mb: 2 }}>
                                    <Box>{step.content}</Box>

                                    {onNext && onBack && onFinish && (
                                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                            <Button variant="outlined" onClick={onBack} disabled={index === 0}>
                                                Back
                                            </Button>
                                            {index < steps.length - 1 ? (
                                                <Button variant="contained" onClick={onNext}>
                                                    Next
                                                </Button>
                                            ) : (
                                                <Button variant="contained" onClick={onFinish}>
                                                    Finish
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </StepContent>
                        )}
                    </Step>
                ))}
            </Stepper>

            {orientation === 'horizontal' && (
                <Box sx={{ mt: 3 }}>
                    <Box sx={{ mb: 2 }}>{steps[activeStep]?.content}</Box>

                    {onNext && onBack && onFinish && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="outlined" onClick={onBack} disabled={activeStep === 0}>
                                Back
                            </Button>
                            {activeStep < steps.length - 1 ? (
                                <Button variant="contained" onClick={onNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={onFinish}>
                                    Finish
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default CustomStepper;
