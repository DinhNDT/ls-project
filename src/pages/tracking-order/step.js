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

export const STEPS_TRACKING = [
  { title: "Đang đợi", description: "Chờ duyệt đơn", key: 2 },
  { title: "Đã duyệt", description: "Chờ qua kho", key: 3 },
  { title: "Hàng đã về kho", description: "Chờ vận chuyển", key: 1 },
  { title: "Vận chuyển", description: "Đang vận chuyển", key: 5 },
  { title: "Hoàn thành", description: "Đã giao", key: 6 },
];

export const StepTracking = ({ status }) => {
  const { activeStep } = useSteps({
    index: STEPS_TRACKING.findIndex((value) => value.key === status),
    count: STEPS_TRACKING.length,
  });
  return (
    <Stepper index={activeStep} colorScheme="pink">
      {STEPS_TRACKING.map((step, index) => (
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
