import { type FeatureCollection } from "geojson";
import { type GeoJSONFeature } from "mapbox-gl";
import { useRef } from "react";
import {
  Layer,
  Map,
  Source,
  type GeoJSONSource,
  type MapRef,
} from "react-map-gl";
import { useNavigate } from "react-router-dom";

import "mapbox-gl/dist/mapbox-gl.css";

import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from "~/configs/layer";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWttYWw5NiIsImEiOiJjbTJqN3BpcGgwMnU3MmpvcW96NTRtb2RoIn0.jxkI7uKnc3mvMqWgIMKuhg";

type FeatureProperties = {
  type: "Place";
  id: string;
  title: string;
  slug: string;
};

export function MapboxView({
  places,
  initialViewState = {
    latitude: -0.4752106,
    longitude: 116.6995672,
    zoom: 4,
  },
  onPlaceClick,
  height,
}: {
  places: any;
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  onPlaceClick: (placeId: string) => void;
  height?: string;
}) {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);

  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features: places.map((place: any) => ({
      type: "Feature",
      properties: {
        type: "Place",
        id: place.id,
        name: place.name,
        active: false,
      },
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
    })),
  };

  const onClick = (event: any) => {
    const features = event.features as GeoJSONFeature[];
    if (!features.length) return;

    const feature = features[0];
    const featureProperties = feature.properties as FeatureProperties;

    if (featureProperties.type === "Place") {
      const placeId = featureProperties.id;
      onPlaceClick(placeId);

      // Get the coordinates of the clicked point
      if (feature.geometry.type === "Point") {
        const [longitude, latitude] = feature.geometry.coordinates;

        // Zoom in to the clicked point
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 12, // Set your desired zoom level here
          speed: 2, // Set the speed of the zoom transition
          curve: 1, // Set the curve of the zoom transition
          easing(t) {
            return t; // You can customize the easing function here
          },
        });
      }

      const updatedGeojson = {
        ...geojson,
        features: geojson.features.map(feat => {
          if (!feat.properties) {
            return feat;
          }

          return {
            ...feat,
            properties: {
              ...feat.properties,
              active: feat.properties.id === placeId,
            },
          };
        }),
      };

      (mapRef.current?.getSource("places-source") as GeoJSONSource)?.setData(
        updatedGeojson,
      );
    }
  };

  const onMouseEnter = (event: any) => {
    const features = event.features as GeoJSONFeature[];
    if (features.length) {
      const canvas = mapRef.current?.getCanvas();
      if (canvas) {
        canvas.style.cursor = "pointer";
      }
    }
  };

  const onMouseLeave = () => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) {
      canvas.style.cursor = "";
    }
  };

  return (
    <Map
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: "100%", height: height || "100vh", borderRadius: 5 }}
      initialViewState={initialViewState}
      mapboxAccessToken={MAPBOX_TOKEN}
      interactiveLayerIds={[
        String(clusterLayer.id),
        String(unclusteredPointLayer.id),
      ]}
      onClick={onClick}
      onMouseMove={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={mapRef}
    >
      <Source
        id="places-source"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </Map>
  );
}
