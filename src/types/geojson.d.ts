declare module '*.geojson' {
  const value: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  export default value;
}
