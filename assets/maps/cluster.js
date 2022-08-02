const avgLngLat = camps => {
    let lngSum = 0, latSum = 0;
    for (const camp of camps) {
        const [lng, lat] = camp.geometry.coordinates;
        lngSum += lng
        latSum += lat
    }
    const avgLng = lngSum / camps.length, avgLat = latSum / camps.length;
    return [avgLng, avgLat]
}

axios.get('https://aqueous-brushlands-12355.herokuapp.com/mapbox')
    .then(json => {
        mapboxgl.accessToken = json.data.mapToken
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: avgLngLat(json.data.camps.features), // [-98.5, 38.8],
            zoom: 3,
            projection: 'globe',
            attributionControl: false
        })
        map.addControl(new mapboxgl.NavigationControl())

        map.on('load', () => {

            map.addSource('campgrounds', {
                type: 'geojson',
                data: json.data.camps,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            })

            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'campgrounds',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': '#4169e1',
                    'circle-radius': [
                        'step', ['get', 'point_count'],
                        10, 10,
                        15, 50,
                        20, 100,
                        30
                    ]
                }
            })

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'campgrounds',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 10
                }
            })

            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'campgrounds',
                filter: ['!has', 'point_count'],
                paint: {
                    'circle-color': '#4169e1',
                    'circle-radius': 5,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#f5f5f5'
                }
            })

            map.on('click', 'clusters', event => {
                const [camp] = map.queryRenderedFeatures(event.point, { layers: ['clusters'] })
                map.getSource('campgrounds').getClusterExpansionZoom(
                    camp.properties.cluster_id,
                    (err, zoom) => {
                        if (err) return;
                        map.easeTo({ center: camp.geometry.coordinates, zoom })
                    }
                )
            })

            map.on('mouseenter', 'clusters', () => {
                map.getCanvas().style.cursor = 'pointer'
            })
            map.on('mouseleave', 'clusters', () => {
                map.getCanvas().style.cursor = ''
            })

            const popup = new mapboxgl.Popup({ closeButton: false })
            const popupEvent = event => {
                const [camp] = event.features
                let [longitude, latitude] = camp.geometry.coordinates

                while (Math.abs(longitude - event.lngLat.lng) > 180)
                    longitude += (longitude < event.lngLat.lng) ? 360 : -360;

                popup
                    .setLngLat([longitude, latitude])
                    .setHTML(camp.properties.popupText)
                    .addTo(map)
            }
            map.on('click', 'unclustered-point', popupEvent)
            map.on('mouseenter', 'unclustered-point', popupEvent)
            map.on('mouseenter', 'unclustered-point', () => {
                map.getCanvas().style.cursor = 'pointer'
            })
            map.on('mouseleave', 'unclustered-point', () => {
                map.getCanvas().style.cursor = ''
            })
        })
    })
    .catch(err => { console.error(err) })