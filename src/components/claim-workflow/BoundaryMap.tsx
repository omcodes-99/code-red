import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import type { ClaimBoundaryFeature } from '../../types/claimDraft';
import {
  buildClaimBoundaryFeature,
  SAMBALPUR_DEFAULT_ZOOM,
} from '../../utils/claimBoundary';

const POLYGON_STYLE: L.PathOptions = {
  color: '#D97706',
  weight: 2,
  fillColor: '#0C2340',
  fillOpacity: 0.28,
};

const DRAW_POLYGON_OPTIONS: L.DrawOptions.PolygonOptions = {
  allowIntersection: false,
  showArea: false,
  shapeOptions: POLYGON_STYLE,
};

export interface BoundaryMapHandle {
  startDraw: () => void;
  startEdit: () => void;
  finishEdit: () => void;
  deletePolygon: () => void;
}

interface BoundaryMapProps {
  claimId: string;
  center: [number, number];
  initialFeature?: ClaimBoundaryFeature | null;
  readOnly?: boolean;
  onFeatureChange: (feature: ClaimBoundaryFeature | null) => void;
}

function ringFromPolygon(layer: L.Polygon): number[][] {
  const latlngs = layer.getLatLngs();
  const ring = (Array.isArray(latlngs[0]) ? latlngs[0] : latlngs) as L.LatLng[];
  return ring.map((ll) => [ll.lng, ll.lat]);
}

function addFeatureToGroup(group: L.FeatureGroup, feature: ClaimBoundaryFeature): L.Polygon {
  const ring = feature.geometry.coordinates[0];
  const latlngs = ring.map(([lng, lat]) => L.latLng(lat, lng));
  const polygon = L.polygon(latlngs, POLYGON_STYLE);
  group.addLayer(polygon);
  return polygon;
}

interface DrawControllerProps {
  claimId: string;
  initialFeature?: ClaimBoundaryFeature | null;
  readOnly?: boolean;
  onFeatureChange: (feature: ClaimBoundaryFeature | null) => void;
  handlersRef: React.MutableRefObject<BoundaryMapHandle | null>;
}

const DrawController: React.FC<DrawControllerProps> = ({
  claimId,
  initialFeature,
  readOnly = false,
  onFeatureChange,
  handlersRef,
}) => {
  const map = useMap();
  const groupRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const polygonDrawerRef = useRef<L.Draw.Polygon | null>(null);
  const editHandlerRef = useRef<L.EditToolbar.Edit | null>(null);
  const claimIdRef = useRef(claimId);
  const onChangeRef = useRef(onFeatureChange);

  claimIdRef.current = claimId;
  onChangeRef.current = onFeatureChange;

  useEffect(() => {
    map.whenReady(() => {
      map.invalidateSize();
    });
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    const timer = window.setTimeout(() => map.invalidateSize(), 200);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
    };
  }, [map]);

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    groupRef.current = drawnItems;
    map.addLayer(drawnItems);

    if (initialFeature?.geometry.coordinates[0]?.length) {
      addFeatureToGroup(drawnItems, initialFeature);
    }

    const emitFromGroup = () => {
      const layers = drawnItems.getLayers();
      const polygon = layers.find((layer): layer is L.Polygon => layer instanceof L.Polygon);
      if (!polygon) {
        onChangeRef.current(null);
        return;
      }
      const feature = buildClaimBoundaryFeature(claimIdRef.current, ringFromPolygon(polygon));
      onChangeRef.current(feature);
    };

    if (!readOnly) {
      const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polygon: DRAW_POLYGON_OPTIONS,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          edit: {
            poly: { allowIntersection: false },
          },
          remove: true,
        },
      });
      map.addControl(drawControl);
      drawControlRef.current = drawControl;
    }

    const onCreated = (event: L.LeafletEvent) => {
      const created = event as L.DrawEvents.Created;
      const layer = created.layer;
      if (!(layer instanceof L.Polygon)) return;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      layer.setStyle(POLYGON_STYLE);
      emitFromGroup();
    };

    const onEditedOrDeleted = () => {
      emitFromGroup();
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEditedOrDeleted);
    map.on(L.Draw.Event.DELETED, onEditedOrDeleted);
    map.on(L.Draw.Event.EDITVERTEX, onEditedOrDeleted);

    const stopDraw = () => {
      polygonDrawerRef.current?.disable();
      polygonDrawerRef.current = null;
    };

    const startDraw = () => {
      if (readOnly) return;
      stopDraw();
      editHandlerRef.current?.disable();
      const drawer = new L.Draw.Polygon(map as unknown as L.DrawMap, DRAW_POLYGON_OPTIONS);
      polygonDrawerRef.current = drawer;
      drawer.enable();
    };

    const startEdit = () => {
      if (readOnly || drawnItems.getLayers().length === 0) return;
      stopDraw();
      editHandlerRef.current?.disable();
      const handler = new L.EditToolbar.Edit(map as unknown as L.DrawMap, {
        featureGroup: drawnItems,
        selectedPathOptions: {
          dashArray: '10, 10',
          fill: true,
          fillOpacity: 0.15,
        },
      });
      editHandlerRef.current = handler;
      handler.enable();
    };

    const finishEdit = () => {
      editHandlerRef.current?.save();
      editHandlerRef.current?.disable();
      editHandlerRef.current = null;
      emitFromGroup();
    };

    const deletePolygon = () => {
      stopDraw();
      editHandlerRef.current?.disable();
      editHandlerRef.current = null;
      drawnItems.clearLayers();
      onChangeRef.current(null);
    };

    handlersRef.current = { startDraw, startEdit, finishEdit, deletePolygon };

    return () => {
      stopDraw();
      editHandlerRef.current?.disable();
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEditedOrDeleted);
      map.off(L.Draw.Event.DELETED, onEditedOrDeleted);
      map.off(L.Draw.Event.EDITVERTEX, onEditedOrDeleted);
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      map.removeLayer(drawnItems);
      groupRef.current = null;
      handlersRef.current = null;
    };
    // initialFeature is applied once when the controller mounts so later draft saves do not reset drawing
  }, [map, readOnly, handlersRef]);

  return null;
};

export const BoundaryMap = forwardRef<BoundaryMapHandle, BoundaryMapProps>(
  function BoundaryMap({ claimId, center, initialFeature, readOnly, onFeatureChange }, ref) {
    const handlersRef = useRef<BoundaryMapHandle | null>(null);

    useImperativeHandle(ref, () => ({
      startDraw: () => handlersRef.current?.startDraw(),
      startEdit: () => handlersRef.current?.startEdit(),
      finishEdit: () => handlersRef.current?.finishEdit(),
      deletePolygon: () => handlersRef.current?.deletePolygon(),
    }));

    return (
      <div className="claim-boundary-map-wrap">
        <MapContainer
          center={center}
          zoom={SAMBALPUR_DEFAULT_ZOOM}
          zoomControl
          className="claim-boundary-map"
          scrollWheelZoom
        >
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <DrawController
            claimId={claimId}
            initialFeature={initialFeature}
            readOnly={readOnly}
            onFeatureChange={onFeatureChange}
            handlersRef={handlersRef}
          />
        </MapContainer>
      </div>
    );
  }
);
