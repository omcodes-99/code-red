export interface SyntheticGisLayer {
  id: string;
  name: string;
  shortName: string;
  category: 'forest' | 'protected_area' | 'agriculture' | 'water';
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
  geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  description: string;
  disclaimer: string;
}

export const forestGeoJson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'FOR-SBP-042',
        name: 'Reserve Forest Compartment #42 (LULC)',
        category: 'Forest / LULC',
        density: 'Moderate Forest Canopy (40–70%)',
        datasetType: 'Prototype / Synthetic GIS Data',
        source: 'BhoomiDrishti Prototype Spatial Engine',
        color: '#16a34a',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.9765, 21.4655],
            [83.978, 21.4665],
            [83.9805, 21.467],
            [83.984, 21.4685],
            [83.986, 21.472],
            [83.9845, 21.476],
            [83.979, 21.477],
            [83.975, 21.474],
            [83.9755, 21.469],
            [83.9765, 21.4655],
          ],
        ],
      },
    },
  ],
};

export const protectedAreasGeoJson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'PA-SBP-007',
        name: 'Wildlife Sanctuary Eco-Sensitive Buffer',
        category: 'Protected Area Overlap',
        status: 'Eco-Sensitive Zone (ESZ) Buffer Fringe',
        datasetType: 'Prototype / Synthetic GIS Data',
        source: 'BhoomiDrishti Prototype Spatial Engine',
        color: '#ea580c',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.968, 21.46],
            [83.9772, 21.462],
            [83.9778, 21.466],
            [83.976, 21.469],
            [83.971, 21.471],
            [83.967, 21.468],
            [83.968, 21.46],
          ],
        ],
      },
    },
  ],
};

export const agricultureGeoJson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'AGR-SBP-104',
        name: 'Customary Agrarian & Traditional Cultivation Patch',
        category: 'Agriculture Overlap',
        type: 'Traditional Settled Cultivation',
        datasetType: 'Prototype / Synthetic GIS Data',
        source: 'BhoomiDrishti Prototype Spatial Engine',
        color: '#ca8a04',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.974, 21.463],
            [83.9825, 21.4635],
            [83.9835, 21.468],
            [83.9805, 21.4715],
            [83.976, 21.471],
            [83.973, 21.467],
            [83.974, 21.463],
          ],
        ],
      },
    },
  ],
};

export const waterGeoJson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'WAT-SBP-019',
        name: 'Village Stream & Drainage Buffer Corridor',
        category: 'Water Overlap',
        bufferMeters: 30,
        datasetType: 'Prototype / Synthetic GIS Data',
        source: 'BhoomiDrishti Prototype Spatial Engine',
        color: '#0284c7',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.9788, 21.476],
            [83.9802, 21.4762],
            [83.981, 21.471],
            [83.9798, 21.4665],
            [83.9815, 21.461],
            [83.98, 21.4608],
            [83.9785, 21.466],
            [83.9795, 21.4712],
            [83.9788, 21.476],
          ],
        ],
      },
    },
  ],
};

export const SAMBALPUR_SYNTHETIC_LAYERS: Record<string, SyntheticGisLayer> = {
  forest: {
    id: 'forest',
    name: 'Forest / LULC (Reserve Forest #42)',
    shortName: 'Forest / LULC',
    category: 'forest',
    color: '#15803D',
    fillColor: '#16A34A',
    fillOpacity: 0.28,
    weight: 2,
    geojson: forestGeoJson,
    description: 'Synthetic Reserve Forest Compartment #42 boundary and moderate forest canopy cover (40–70%).',
    disclaimer: 'Prototype / Synthetic GIS Data — For Demonstration Only — Not an official government dataset.',
  },
  protected_area: {
    id: 'protected_area',
    name: 'Protected Area Buffer (Sanctuary Fringe)',
    shortName: 'Protected Area',
    category: 'protected_area',
    color: '#C2410C',
    fillColor: '#EA580C',
    fillOpacity: 0.26,
    weight: 2,
    geojson: protectedAreasGeoJson,
    description: 'Synthetic Eco-Sensitive Zone (ESZ) sanctuary boundary fringe.',
    disclaimer: 'Prototype / Synthetic GIS Data — For Demonstration Only — Not an official government dataset.',
  },
  agriculture: {
    id: 'agriculture',
    name: 'Customary Agrarian & Traditional Cultivation',
    shortName: 'Agriculture',
    category: 'agriculture',
    color: '#A16207',
    fillColor: '#CA8A04',
    fillOpacity: 0.24,
    weight: 2,
    geojson: agricultureGeoJson,
    description: 'Synthetic customary cultivation zone and traditional agro-ecological parcel boundary.',
    disclaimer: 'Prototype / Synthetic GIS Data — For Demonstration Only — Not an official government dataset.',
  },
  water: {
    id: 'water',
    name: 'Waterbody & Drainage Buffer Corridor',
    shortName: 'Waterbody',
    category: 'water',
    color: '#0369A1',
    fillColor: '#0284C7',
    fillOpacity: 0.3,
    weight: 2,
    geojson: waterGeoJson,
    description: 'Synthetic seasonal stream corridor and 30m riparian drainage buffer.',
    disclaimer: 'Prototype / Synthetic GIS Data — For Demonstration Only — Not an official government dataset.',
  },
};
