import { type FeatureCollection } from "geojson";
import { MapMouseEvent, type GeoJSONFeature } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import {
  Layer,
  Map,
  NavigationControl,
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
import { MAPBOX_ACCESS_TOKEN } from "~/lib/env";
import { PlaceItem } from "~/types/model";

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
  hasCityParam,
  initialViewState = places.length > 0 && places[0] && hasCityParam
    ? {
        latitude: places[0].latitude,
        longitude: places[0].longitude,
        zoom: 11,
      }
    : {
        latitude: -2.966349,
        longitude: 110.127247,
        zoom: 3,
      },
  onPlaceClick,
  height,
  showMap,
}: {
  places: PlaceItem[];
  hasCityParam?: boolean;
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
    if (mapRef.current) {
      mapRef.current.flyTo({
        center:
          (height && places[0]) || (hasCityParam && places[0])
            ? [places[0].longitude, places[0].latitude]
            : [110.127247, -2.966349],
        zoom: height || hasCityParam ? 11 : 3,
        speed: 2,
      });

      if (showMap) {
        mapRef.current.resize();
      }
    }
  }, [showMap, places, hasCityParam, height]);

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

      // Get the source and fetch the expansion zoom level for the cluster
      const source = mapRef.current.getSource("places-source") as GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !mapRef.current) return;

        if (feature.geometry.type === "Point") {
          const coordinates = feature.geometry.coordinates as [number, number];
          mapRef.current.easeTo({
            center: coordinates,
            zoom: zoom ?? 3,
            duration: 1000,
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
          center: [longitude ?? 110.127247, latitude ?? -2.966349],
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
    if (features.length && features[0]) {
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
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
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
        clusterMaxZoom={30}
        clusterRadius={20}
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
      <NavigationControl />
    </Map>
  );
}
