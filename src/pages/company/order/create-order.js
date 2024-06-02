import { useParams } from "react-router-dom";
import CreateOrderForm from "../../../components/Order/FormAdd";

function CreateOrderPage({ id }) {
  return (
    <>
      <CreateOrderForm id={id} />
    </>
  );
}

export default CreateOrderPage;
