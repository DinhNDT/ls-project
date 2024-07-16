import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from "@chakra-ui/react";
import React from "react";

const steps = [
  { title: "Đang đợi", description: "Contact Info" },
  { title: "Đã duyệt", description: "Date & Time" },
  { title: "Hàng đã về kho", description: "Select Rooms" },
  { title: "Vận chuyển", description: "Select Rooms" },
  { title: "Hoàn thành", description: "Select Rooms" },
];

export const StepTracking = () => {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  return (
    <Stepper index={activeStep} colorScheme="pink">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};
