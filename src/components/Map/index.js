import { Source, Layer, Marker } from "@goongmaps/goong-map-react";
import MapGL from "@goongmaps/goong-map-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const GoongMapWithRoute = ({
  apiKey = "c3biqFrn7Ypy1v8t0L6rUqbMEjO0Az3pGEMUeEca",
  isOpen,
  onClose,
  coordinates,
}) => {
  const [viewport, setViewport] = useState({
    latitude: 21.026975,
    longitude: 105.85346,
    zoom: 5,
  });

  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (coordinates.length) {
      const calculateRoute = async () => {
        const waypoints = coordinates
          .map((coord) => `${coord?.position[1]},${coord?.position[0]}`)
          .join("|");
        try {
          const response = await axios.get(
            `https://rsapi.goong.io/Direction?origin=${waypoints}&destination=${waypoints}&vehicle=car&api_key=${apiKey}`
          );
          const data = response.data;
          const routeCoordinates = data.routes[0].geometry.coordinates;
          setRoute({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          });
        } catch (error) {
          // console.error("Error fetching directions:", error);
        }
      };

      calculateRoute();
    }
  }, [coordinates, apiKey]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Vị trí gói hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <MapGL
            {...viewport}
            width="100%"
            height="70vh"
            onViewportChange={setViewport}
            goongApiAccessToken={apiKey}
          >
            {coordinates.map((coord, index) => (
              <Marker
                key={index}
                longitude={coord?.position[0]}
                latitude={coord?.position[1]}
              >
                <div
                  style={{
                    backgroundColor: "red",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50px",
                    fontSize: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  <p>{coord?.orderId}</p>
                </div>
              </Marker>
            ))}

            {route && (
              <Source id="route" type="geojson" data={route}>
                <Layer
                  id="route"
                  type="line"
                  layout={{
                    "line-join": "round",
                    "line-cap": "round",
                  }}
                  paint={{
                    "line-color": "#888",
                    "line-width": 8,
                  }}
                />
              </Source>
            )}
          </MapGL>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default GoongMapWithRoute;
