import { type FeatureCollection } from "geojson";
import { MapMouseEvent, type GeoJSONFeature } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import {
  Layer,
  Map,
  Popup,
  Source,
  type GeoJSONSource,
  type MapRef,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from "~/configs/layer";
import { PlaceItem } from "~/types/model";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWttYWw5NiIsImEiOiJjbTJqN3BpcGgwMnU3MmpvcW96NTRtb2RoIn0.jxkI7uKnc3mvMqWgIMKuhg";

type FeatureProperties = {
  type: "Place";
  id: string;
  title: string;
  slug: string;
  name: string;
  thumbnailUrl: string;
};

export function MapboxView({
  places,
  initialViewState = places.length > 0
    ? {
        latitude: places[0].latitude,
        longitude: places[0].longitude,
        zoom: 11,
      }
    : {
        latitude: -0.4752106,
        longitude: 116.6995672,
        zoom: 12,
      },
  onPlaceClick,
  height,
  showMap,
}: {
  places: PlaceItem[];
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  onPlaceClick: (placeId: string) => void;
  height?: string;
  showMap?: any;
}) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    name: string;
    thumbnailUrl?: string;
  } | null>(null);

  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features: places.map((place: any) => ({
      type: "Feature",
      properties: {
        type: "Place",
        id: place.id,
        name: place.name,
        thumbnailUrl: place.thumbnailUrl,
        active: false,
      },
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
    })),
  };

  useEffect(() => {
    if (showMap && mapRef.current) {
      mapRef.current.resize();
    }
  }, [showMap]);

  const onClick = (event: MapMouseEvent) => {
    const features = event.features as GeoJSONFeature[];
    if (!features.length) return;

    const feature = features[0];
    const map = mapRef.current;

    if (!map || !feature || !feature.layer) return;

    const featureProperties = feature.properties as FeatureProperties;

    // Check if the clicked feature is a cluster
    if (feature.layer.id === clusterLayer.id) {
      const clusterId = feature.id as number;

      const source = map.getSource("places-source") as GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, err => {
        if (err) return;

        if (feature.geometry.type === "Point") {
          const [longitude, latitude] = feature.geometry.coordinates as [
            number,
            number,
          ];

          // Fly to the cluster with expanded zoom
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            speed: 2,
          });
        }
      });
    } else if (featureProperties.type === "Place") {
      const placeId = featureProperties.id;
      onPlaceClick(placeId);

      if (feature.geometry.type === "Point") {
        const [longitude, latitude] = feature.geometry.coordinates;

        // Zoom in to the clicked point
        map.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          speed: 2,
        });
      }

      // Update geojson with active state for clicked place
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

      (map.getSource("places-source") as GeoJSONSource)?.setData(
        updatedGeojson,
      );
    }
  };

  const onMouseEnter = (event: MapMouseEvent) => {
    const features = event.features as GeoJSONFeature[];
    if (features.length) {
      const feature = features[0];
      const featureProperties = feature.properties as FeatureProperties;

      if (
        feature.geometry.type === "Point" &&
        featureProperties.type === "Place"
      ) {
        const coordinates = feature.geometry.coordinates as [number, number];
        const [longitude, latitude] = coordinates;

        setPopupInfo({
          longitude,
          latitude,
          name: featureProperties.name,
          thumbnailUrl: featureProperties.thumbnailUrl,
        });
      }
    }
  };

  const onMouseLeave = () => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) {
      canvas.style.cursor = "";
    }
    setPopupInfo(null);
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

      {popupInfo && popupInfo.thumbnailUrl && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
          anchor="top"
          className="rounded-lg"
        >
          <img
            src={popupInfo.thumbnailUrl}
            alt={popupInfo.name}
            className="mb-2 h-40 w-40 rounded-md object-cover"
          />

          <p className="text-center text-xs font-semibold text-gray-800">
            {popupInfo.name}
          </p>
        </Popup>
      )}
    </Map>
  );
}
