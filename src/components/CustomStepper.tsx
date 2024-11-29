import React from 'react';
import { Box, Button, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';

export interface StepItem {
    title: string;
    content: React.ReactNode;
    optional?: boolean;
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
                        <StepLabel>
                            {step.title}
                            {step.optional && (
                                <Typography component="span" variant="caption" sx={{ ml: 1, fontStyle: 'italic' }}>
                                    (Optional)
                                </Typography>
                            )}
                        </StepLabel>
                        {orientation === 'vertical' && (
                            <StepContent>
                                <Box sx={{ mb: 2 }}>
                                    <Box marginTop={1}>{step.content}</Box>

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
                <Box sx={{ m: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography>
                            <strong>{steps[activeStep]?.title}</strong>
                            {steps[activeStep]?.optional && (
                                <Typography component="span" variant="caption" sx={{ ml: 1, fontStyle: 'italic' }}>
                                    (Optional)
                                </Typography>
                            )}
                        </Typography>

                        <Box marginTop={2}>{steps[activeStep]?.content}</Box>
                    </Box>

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
