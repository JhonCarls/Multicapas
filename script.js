document.addEventListener('DOMContentLoaded', (event) => {
    // Inicializar el mapa centrado en Nueva York
    var mapa = L.map('mapa').setView([40.7128, -74.0060], 12);

    // Cargar capa de mosaicos de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Cargar estaciones de metro
    var capaEstacionesMetro = L.geoJson(null, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Estación: ' + feature.properties.name);
        }
    }).addTo(mapa);

    fetch('https://data.cityofnewyork.us/resource/kk4q-3rt2.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }
            return response.json();
        })
        .then(data => {
            capaEstacionesMetro.addData(data);
        })
        .catch(error => {
            console.error('Error al cargar datos de estaciones de metro:', error);
        });

    // Cargar parques
    var capaParques = L.geoJson(null, {
        style: function (feature) {
            return { color: 'green' };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Parque: ' + feature.properties.name);
        }
    }).addTo(mapa);

    fetch('https://data.cityofnewyork.us/resource/p7jc-c8ak.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }
            return response.json();
        })
        .then(data => {
            capaParques.addData(data);
        })
        .catch(error => {
            console.error('Error al cargar datos de parques:', error);
        });

    // Cargar rutas de aviones
    var capaRutasAviones = L.geoJson(null, {
        style: function (feature) {
            return { color: 'blue' };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Ruta de Avión');
        }
    }).addTo(mapa);

    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NY/New%20York.geo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }
            return response.json();
        })
        .then(data => {
            capaRutasAviones.addData(data);
        })
        .catch(error => {
            console.error('Error al cargar datos de rutas de aviones:', error);
        });

    // Cargar carriles para bicicletas
    var capaCarrilesBicicletas = L.geoJson(null, {
        style: function (feature) {
            return { color: 'red' };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Carril para Bicicletas');
        }
    }).addTo(mapa);

    fetch('https://data.cityofnewyork.us/Transportation/Bike-Routes/r27e-u3sy')
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }
            return response.json();
        })
        .then(data => {
            capaCarrilesBicicletas.addData(data);
        })
        .catch(error => {
            console.error('Error al cargar datos de carriles para bicicletas:', error);
        });

    // Control de capas
    var mapasBase = {};
    var mapasSuperpuestos = {
        "Estaciones de Metro": capaEstacionesMetro,
        "Parques": capaParques,
        "Rutas de Aviones": capaRutasAviones,
        "Carriles para Bicicletas": capaCarrilesBicicletas
    };

    L.control.layers(mapasBase, mapasSuperpuestos).addTo(mapa);

    // Leyenda
    var leyenda = L.control({position: 'bottomright'});

    leyenda.onAdd = function (mapa) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<i style="background: blue"></i> Rutas de Aviones<br>';
        div.innerHTML += '<i style="background: green"></i> Parques<br>';
        div.innerHTML += '<i style="background: red"></i> Carriles para Bicicletas<br>';
        div.innerHTML += '<i style="background: gray"></i> Estaciones de Metro<br>';
        return div;
    };

    leyenda.addTo(mapa);
});
