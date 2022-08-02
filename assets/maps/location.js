axios.get('https://aqueous-brushlands-12355.herokuapp.com/mapbox')
    .then(json => {
        const { mapToken, position } = json.data
        mapboxgl.accessToken = mapToken
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: position,
            zoom: 10,
            projection: 'globe',
            attributionControl: false
        })

        new mapboxgl.Marker({
            anchor: 'bottom',
            color: 'rgb(191, 35, 3)'
        })
            .setLngLat(position)
            .addTo(map)

        map.addControl(new mapboxgl.NavigationControl())
    })
    .catch(err => console.error(err))


