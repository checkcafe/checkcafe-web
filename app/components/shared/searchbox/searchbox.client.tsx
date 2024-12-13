import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_ACCESS_TOKEN } from "~/lib/env";
import { getCoordinates } from "~/utils/getCoordinateData";

type Marker = {
  longitude: number;
  latitude: number;
} | null;

export default function MapWithGeocoder({
  coordinate,
  setCoordinates,
}: {
  coordinate: Marker | null;
  setCoordinates: (value: React.SetStateAction<Marker>) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapInstanceRef = useRef<mapboxgl.Map | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  console.log(coordinate, "coordinate");
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
    // Add navigation control and marker
    map.addControl(new mapboxgl.NavigationControl());
    new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(
        coordinate
          ? [coordinate.longitude, coordinate.latitude]
          : [118.64493557421042, 0.1972476798250682],
      )
      .on("dragend", e => {
        console.log(
          e.target._lngLat,
          e.target._lngLat.lat,
          e.target._lngLat.lng,
        ),
          "dragend";
        const { lng, lat } = e.target._lngLat;
        setCoordinates({
          longitude: lng,
          latitude: lat,
        });
      })
      .addTo(map);
    map.jumpTo({
      center: coordinate
        ? [coordinate.longitude, coordinate.latitude]
        : [118.64493557421042, 0.1972476798250682],
      zoom: coordinate ? 17 : 3,
      //   speed: 4,
      //     //   curve: 0.7,
      //     //   easing: t => t,
      //     //   essential: true,
      //     // noMoveStart: true,
      //   duration: 1000,
    });
    //   ._addMarker(
    //     new mapboxgl.Marker()
    //       .setLngLat(
    //         coordinate
    //           ? [coordinate.longitude, coordinate.latitude]
    //           : [118.64493557421042, 0.1972476798250682],
    //       )
    //       .addTo(map),
    //   );
    // Set map loaded state
    map.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, [coordinate]);

  return (
    <>
      <SearchBox
        accessToken={MAPBOX_ACCESS_TOKEN}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={d => {
          setInputValue(d);
        }}
        onRetrieve={d => {
          const data: any = d;
          const { latitude, longitude } = getCoordinates(data);
          setCoordinates({
            latitude,
            longitude,
          });
        }}
        marker={true}
      />
      <div id="map-container" ref={mapContainerRef} style={{ height: 300 }} />
    </>
  );
}
