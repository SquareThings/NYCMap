//import {myKey} from './private/key';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hyYXZ5YS1zb21wYWxsaSIsImEiOiJjbGEycmZ3YnAwMzA4M3dwbjExejNqeDczIn0.U0UKRmRLgqJVkz1BizIQBg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-74.0059, 40.7128],
    zoom: 11
});

map.on('load', () => {
    let filterYear = ['==', ['number', ['get', 'ARREST_YEAR']], 2022];
    let filterP = ['==', ['string', ['get', 'LAW_CODE']], "PL 2300000"]
    let filterU = ['==', ['string', ['get', 'LAW_CODE']], "ED 6512001"]

    map.addLayer({
        id: 'collisions',
        type: 'heatmap',
        source: {
            type: 'geojson',
            data: 'arrests_by_year.geojson'
        },

        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        paint: {
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                0.3,
                0.5,
                1
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.

            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                3,
                5
            ],
            //viridis RGB values
            /*
            'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(68,1,84,0)',
            0.2,
            'rgb(72,40,142)',
            0.4,
            'rgb(49,104,142)',
            0.6,
            'rgb(31,158,137)',
            0.8,
            'rgb(109,205,89)',
            1,
            'rgb(253,231,37)'
            ]},*/


            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(80,29,0,0)',
                0.2,
                'rgb(140,50,0)',
                0.4,
                'rgb(255,71,0)',
                0.6,
                'rgb(253,146,87)',
                0.8,
                'rgb(255,184,145)',
                1,
                'rgb(255,210,185)'
            ]
        },
        /*
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(48,0,100,0)',
            0.2,
            'rgb(105,5,220)',
            0.4,
            'rgb(150,55,255)',
            0.6,
            'rgb(182,115,255)',
            0.8,
            'rgb(208,165,255)',
            1,
            'rgb(229,205,255)'
            ]},*/

        'filter': ['all', filterYear, filterP]
    });

    map.addLayer({
        id: 'collisions1',
        type: 'heatmap',
        source: {
            type: 'geojson',
            data: '../arrests_by_year.geojson'
        },

        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        paint: {
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                0.3,
                0.5,
                1
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.

            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                2,
                3,
                5
            ],
            //red-blue RGB values
            /*
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)'
                ]},*/
            /*'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(0,72,100,0)',
                0.2,
                'rgb(0,114,160)',
                0.4,
                'rgb(0,171,240)',
                0.6,
                'rgb(85,206,255)',
                0.8,
                'rgb(165,229,255)',
                1,
                'rgb(205,240,255)'
                ]},*/
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(0,0,100,0)',
                0.2,
                'rgb(0,0,150)',
                0.4,
                'rgb(55,55,255)',
                0.6,
                'rgb(115,115,255)',
                0.8,
                'rgb(165,165,255)',
                1,
                'rgb(205,205,255)'
            ]
        },

        'filter': ['all', filterYear, filterU]
    });


    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', (event) => {
        const year = parseInt(event.target.value);
        // update the map
        filterYear = ['<=', ['number', ['get', 'ARREST_YEAR']], year];
        filterP = ['==', ['string', ['get', 'LAW_CODE']], "PL 2300000"]
        filterU = ['==', ['string', ['get', 'LAW_CODE']], "ED 6512001"]
        map.setFilter('collisions', ['all', filterYear, filterP]);
        map.setFilter('collisions1', ['all', filterYear, filterU]);
        // update text in the UI
        document.getElementById('active-year').innerText = year;
    });

    document
        .getElementById('filters')
        .addEventListener('change', (event) => {
            const charge = event.target.value;
            map.setFilter('collisions', ['all', filterYear, filterP]);
            // update the map filter
            if (charge === 'all') {
                map.setLayoutProperty(
                    'collisions',
                    'visibility',
                    'visible'
                );
                map.setLayoutProperty(
                    'collisions1',
                    'visibility',
                    'visible'
                );
            } else if (charge === 'prostitution') {
                map.setLayoutProperty(
                    'collisions1',
                    'visibility',
                    'none'
                );
                map.setLayoutProperty(
                    'collisions',
                    'visibility',
                    'visible'
                );
            } else if (charge === 'unlicensed massage') {
                map.setLayoutProperty(
                    'collisions',
                    'visibility',
                    'none'
                );
                map.setLayoutProperty(
                    'collisions1',
                    'visibility',
                    'visible'
                );
            } else {
                console.error('error');
            }
        });

});
