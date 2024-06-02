import Aos from "aos";
import SimpleThreeColumns from "../components/IndexPage/Feature";
import CallToActionWithVideo from "../components/IndexPage/Hero";
import WithSpeechBubbles from "../components/IndexPage/Testimonials";
import { useEffect } from "react";
import GridListWithHeading from "../components/IndexPage/Rules";

function IndexPage() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <>
      <CallToActionWithVideo />
      <SimpleThreeColumns />
      <GridListWithHeading />
      <WithSpeechBubbles />
    </>
  );
}

export default IndexPage;
