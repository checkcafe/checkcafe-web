import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_ACCESS_TOKEN } from "~/lib/env";
import { getCoordinates } from "~/utils/getCoordinateData";

type Marker = {
  longitude: number;
  latitude: number;
} | null;
export default function MapWithSearchbox({
  coordinate,
  setCoordinates,
}: {
  coordinate: Marker | null;
  setCoordinates: (value: React.SetStateAction<Marker>) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Create the Map instance
    const map = new mapboxgl.Map({
      attributionControl: false,
      container: mapContainerRef.current || "", // container ID
      center: [118.64493557421042, 0.1972476798250682], // starting position [lng, lat]
      zoom: 3, // starting zoom
      accessToken: MAPBOX_ACCESS_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
    });
    mapInstanceRef.current = map;

    new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(
        coordinate
          ? [coordinate.longitude, coordinate.latitude]
          : [118.64493557421042, 0.1972476798250682],
      )
      .on("dragend", e => {
        const { lng, lat } = e.target._lngLat;
        setCoordinates({
          longitude: lng,
          latitude: lat,
        });
      })
      .addTo(map); // Add navigation control and marker

    map.addControl(new mapboxgl.NavigationControl());

    map.jumpTo({
      center: coordinate
        ? [Number(coordinate.longitude), Number(coordinate.latitude)]
        : [118.64493557421042, 0.1972476798250682],
      zoom: coordinate ? 17 : 3,
    });

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, [coordinate]);

  // Conditionally render the SearchBox only when the map is loaded
  return (
    <div>
      <SearchBox
        accessToken={MAPBOX_ACCESS_TOKEN}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d: any) => {
          setInputValue(d);
        }}
        onRetrieve={(d: any) => {
          const { latitude, longitude } = getCoordinates(d);
          setCoordinates({
            latitude,
            longitude,
          });
        }}
        marker={true}
      />
      <div id="map-container" ref={mapContainerRef} style={{ height: 300 }} />
    </div>
  );
}
