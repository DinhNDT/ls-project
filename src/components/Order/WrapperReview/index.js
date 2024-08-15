import React, { useState } from "react";
import { FormUpdateImg } from "../FormAdd/FormUpdateImg";
import { ReviewOrder } from "../ReviewOrder";

export const WrapperReview = ({
  order,
  companyDataProps,
  onBackOrder,
  orderBill,
  handleSubmit,
}) => {
  const [nextStep, setNextStep] = useState({
    isNext: false,
    orderId: "",
    trackingNumber: "",
  });

  return (
    <>
      {!nextStep.isNext ? (
        <ReviewOrder
          orderProps={order}
          companyDataProps={companyDataProps}
          orderBill={orderBill}
          onBackOrder={onBackOrder}
          handleSubmit={handleSubmit}
          setNextToUpdateImg={setNextStep}
        />
      ) : (
        <FormUpdateImg
          id={nextStep.orderId}
          trackingNumber={nextStep.trackingNumber}
        />
      )}
    </>
  );
};
