import Aos from "aos";
import CallToActionWithVideo from "../components/IndexPage/Hero";
import { useEffect } from "react";

function IndexPage() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return <CallToActionWithVideo />;
}

export default IndexPage;
