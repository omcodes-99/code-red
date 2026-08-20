export interface HistoricalObservationConfig {
  year: number;
  label: string;
  season: string;
  acquisitionDate: string;
  sensor: string;
  resolution: string;
  apparentLandCover: string;
  canopyDensityEstimate: string;
  cultivationIndicators: string;
  waterFeatureContext: string;
  sceneId: string;
  datasetType: string;
  disclaimer: string;
  tileLayerUrl: string;
  tileAttribution: string;
  tileFilter?: string;
}

export const HISTORICAL_OBSERVATIONS: HistoricalObservationConfig[] = [
  {
    year: 2014,
    label: '2014 — Pre-Survey Baseline Observation',
    season: 'Post-Monsoon (Nov 2014)',
    acquisitionDate: '14 November 2014',
    sensor: 'Landsat-8 OLI (Prototype Demo Scene)',
    resolution: '15m Panchromatic / 30m Multi-spectral',
    apparentLandCover: 'Traditional agro-forestry parcel demarcation with early customary clearing',
    canopyDensityEstimate: '15% open tree canopy along parcel perimeter',
    cultivationIndicators: 'Clear customary field bund alignments visible',
    waterFeatureContext: 'Seasonal tributary drainage visible along eastern border',
    sceneId: 'LC08_L1TP_141045_20141114_DEMO',
    datasetType: 'Prototype Historical Observation — Demonstration Data',
    disclaimer:
      'Prototype Demonstration Data — For demonstration of temporal review workflow under FRA 2006. Not an official survey dataset.',
    tileLayerUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileAttribution: 'Tiles &copy; Esri &mdash; Prototype Earth Observation Demo',
    tileFilter: 'sepia(0.25) contrast(1.1) brightness(0.95)',
  },
  {
    year: 2018,
    label: '2018 — Mid-Decade Archival Pass',
    season: 'Kharif Cultivation Season (Oct 2018)',
    acquisitionDate: '22 October 2018',
    sensor: 'Sentinel-2A MSI (Prototype Demo Scene)',
    resolution: '10m Multi-spectral',
    apparentLandCover: 'Settled traditional rainfed agricultural cultivation',
    canopyDensityEstimate: '8% peripheral canopy / open settled farmland',
    cultivationIndicators: 'Continuous crop plot partitioning and customary bunding',
    waterFeatureContext: 'Active post-monsoon surface moisture in drainage depression',
    sceneId: 'S2A_MSIL2A_20181022_DEMO',
    datasetType: 'Prototype Historical Observation — Demonstration Data',
    disclaimer:
      'Prototype Demonstration Data — For demonstration of temporal review workflow under FRA 2006. Not an official survey dataset.',
    tileLayerUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileAttribution: 'Tiles &copy; Esri &mdash; Prototype Earth Observation Demo',
    tileFilter: 'saturate(1.2) contrast(1.05)',
  },
  {
    year: 2021,
    label: '2021 — Multi-Season Verification Pass',
    season: 'Late Kharif / Rabi Preparation (Dec 2021)',
    acquisitionDate: '08 December 2021',
    sensor: 'Sentinel-2B MSI (Prototype Demo Scene)',
    resolution: '10m High-Resolution Multi-spectral',
    apparentLandCover: 'Established customary cultivation with preserved boundary trees',
    canopyDensityEstimate: '6% canopy / active field parcel',
    cultivationIndicators: 'High spectral uniformity across demarcated parcel boundaries',
    waterFeatureContext: 'Stable riparian stream corridor bounding north-eastern corner',
    sceneId: 'S2B_MSIL2A_20211208_DEMO',
    datasetType: 'Prototype Historical Observation — Demonstration Data',
    disclaimer:
      'Prototype Demonstration Data — For demonstration of temporal review workflow under FRA 2006. Not an official survey dataset.',
    tileLayerUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileAttribution: 'Tiles &copy; Esri &mdash; Prototype Earth Observation Demo',
    tileFilter: 'brightness(1.02) contrast(1.08)',
  },
  {
    year: 2024,
    label: '2024 — Recent Pre-Filing Observation',
    season: 'Peak Kharif Harvest (Nov 2024)',
    acquisitionDate: '18 November 2024',
    sensor: 'Resourcesat-2A LISS-IV (Prototype Demo Scene)',
    resolution: '5.8m Multi-spectral',
    apparentLandCover: 'Sustained agricultural land-use with no unauthorized expansion',
    canopyDensityEstimate: '5% peripheral agro-forestry',
    cultivationIndicators: 'Demarcated field tracks and traditional stone/mud bunding',
    waterFeatureContext: 'Natural drainage depression with seasonal vegetative growth',
    sceneId: 'RS2A_LISS4_20241118_DEMO',
    datasetType: 'Prototype Historical Observation — Demonstration Data',
    disclaimer:
      'Prototype Demonstration Data — For demonstration of temporal review workflow under FRA 2006. Not an official survey dataset.',
    tileLayerUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileAttribution: 'Tiles &copy; Esri &mdash; Prototype Earth Observation Demo',
    tileFilter: 'contrast(1.12) saturate(1.15)',
  },
  {
    year: 2025,
    label: '2025 — Current Ground Baseline Reference',
    season: 'Current Operational Verification (Jan 2025)',
    acquisitionDate: '26 January 2025',
    sensor: 'Sentinel-2C & DGPS Georeferenced (Prototype Demo Scene)',
    resolution: '10m / Georeferenced',
    apparentLandCover: 'Current active customary land holding matching submitted boundary',
    canopyDensityEstimate: '5% canopy / active customary agriculture',
    cultivationIndicators: 'Full congruence with submitted polygon boundary',
    waterFeatureContext: 'Drainage corridor stable with statutory buffer clearance',
    sceneId: 'S2C_OPER_20250126_DEMO',
    datasetType: 'Prototype Historical Observation — Demonstration Data',
    disclaimer:
      'Prototype Demonstration Data — For demonstration of temporal review workflow under FRA 2006. Not an official survey dataset.',
    tileLayerUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileAttribution: 'Tiles &copy; Esri &mdash; Prototype Earth Observation Demo',
    tileFilter: 'none',
  },
];

export const SUPPORTED_HISTORICAL_YEARS = HISTORICAL_OBSERVATIONS.map((o) => o.year);

export function getHistoricalObservation(year: number): HistoricalObservationConfig {
  const found = HISTORICAL_OBSERVATIONS.find((o) => o.year === year);
  return found || HISTORICAL_OBSERVATIONS[0];
}
