import type { LayerProps } from "react-map-gl"

export const clusterLayer: LayerProps = {
    id: "clusters",
    type: "circle",
    source: "places-source",
    filter: ["has", "point_count"],
    paint: {
        "circle-color": [
            "step",
            ["get", "point_count"],
            "#047857", // Green color
            100,
            "#f1f075",
            750,
            "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        "circle-stroke-width": 2, // Adding a border to the clusters
        "circle-stroke-color": "#ffffff", // White border color
    },
}

export const clusterCountLayer: LayerProps = {
    id: "cluster-count",
    type: "symbol",
    source: "places-source",
    filter: ["has", "point_count"],
    layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
    },
    paint: {
        "text-color": "#ffffff", // White color for the text
    },
}

export const unclusteredPointLayer: LayerProps = {
    id: "unclustered-point",
    type: "circle",
    source: "places-source",
    filter: ["!", ["has", "point_count"]],
    paint: {
        "circle-color": ["case", ["==", ["get", "active"], true], "#1d4ed8", "#047857"],
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
    },
}
