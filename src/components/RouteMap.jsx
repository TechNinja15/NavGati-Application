import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export default function RouteMap({ stops }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef(null);
    // Mock coordinates for demo purposes (Raipur area)
    const generateMockCoordinates = (stopNames) => {
        let baseLat = 21.2514;
        let baseLng = 81.6296;
        return stopNames.map((name, index) => ({
            name,
            lat: baseLat + (index * 0.01),
            lng: baseLng + (index * 0.01)
        }));
    };
    useEffect(() => {
        if (!mapContainerRef.current)
            return;
        // Initialize Map Instance if needed
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current).setView([21.2514, 81.6296], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstanceRef.current);
            markersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
        }
        // Update markers and path
        const map = mapInstanceRef.current;
        const layerGroup = markersRef.current;
        if (map && layerGroup) {
            layerGroup.clearLayers();
            const mapStops = generateMockCoordinates(stops);
            if (mapStops.length === 0)
                return;
            const latLngs = mapStops.map(s => [s.lat, s.lng]);
            // Draw Polyline
            L.polyline(latLngs, {
                color: 'hsl(215 100% 60%)', // Approximate primary color
                weight: 4,
                opacity: 0.8
            }).addTo(layerGroup);
            // Draw Circle Markers
            mapStops.forEach((stop, index) => {
                L.circleMarker([stop.lat, stop.lng], {
                    radius: 8,
                    color: 'white',
                    fillColor: 'hsl(142 76% 36%)', // Greenish for stops
                    fillOpacity: 1,
                    weight: 2
                })
                    .bindPopup(`<b>${stop.name}</b><br>Stop #${index + 1}`)
                    .addTo(layerGroup);
            });
            // Fit bounds
            if (latLngs.length > 0) {
                map.fitBounds(latLngs, { padding: [50, 50] });
            }
        }
        // Cleanup on unmount
        return () => {
            // We generally keep the map instance alive if the component stays mounted, 
            // but if we wanted full cleanup:
            // map.remove() 
            // mapInstanceRef.current = null
        };
    }, [stops]);
    return (<div className="h-64 w-full rounded-lg overflow-hidden shadow-card border border-border z-0 relative">
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}/>
        </div>);
}
