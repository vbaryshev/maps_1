const fetchAndFilterCities = async () => {
    const response = await fetch("./data/populated_places.geojson");
    const allCities = await response.json();
    const bigCities = {
        ...allCities,
        features: allCities.features.filter(feature => feature.properties.POP_MAX > 5000)
    };
    console.log(allCities);
    return bigCities;
};//функция фильтрации по параметра 
const cities = fetchAndFilterCities().then(result => console.log(result));
//функция фильтрации по параметра 

const getColor = (pop) =>{
    return pop > 500000
         ?[128,0,38]
         : pop > 200000
         ?[189,0,38]
         : pop > 120000
         ?[227,26,28]
         : pop > 80000
         ?[252,78,42]
         : pop > 50000
         ?[253,141,60]
         : pop > 30000
         ?[254,178,76]
         : pop > 10000
         ?[254,217,118]
         :[255, 237, 160];
};

const deckgl = new deck.DeckGL({
//    style: {
 //       backgroundColor: "rgb(80, 50, 250)"
//    },
    mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
    container: "map",
    initialViewState: {
        latitude: 55.66,
        longitude: 37.57,
        zoom: 7,
        bearing: 0,
        pitch: 0
    },
    controller: true,
 //   o: {isHowering, //изменение курсора
 //       isDraging

 //   }
    getCursor: ({isHovering, isDragging}) => isHovering ? "pointer" : isDragging ? "grabbing" : "grab",//изменение курсора
    layers: [   
        new deck.GeoJsonLayer({ //Добавление нового слоя с реками, полигон
            id: "rivers_poly",
            data: "./data/water_mo.geojson",
            filled: true,
            getFillColor: [110,218,222],
            //getLineColor: [80,50,125]
        }),
        new deck.GeoJsonLayer({ //Добавление нового слоя с реками, полигон
            id: "rivers_line",
            data: "./data/water_line_mo.geojson",
            filled: true,
            getLineColor: [110,218,222],
            lineWidthUnits: "pixels", // Единицы измерения ширины линии
            lineWidthScale: 0.25 // Масштаб ширины линии
            //getLineColor: [80,50,125]
        }),
        new deck.GeoJsonLayer({
            id: "countries", //комментарий параметры стиля полигона
            data: "./data/mos_mo_poi.geojson",
            stroked: true,
            getLineColor: [255,255,255],
            lineWidthMinPixels: 1,
            filled: true,
            getFillColor: (feature) => getColor(feature.properties.mosstat_po)
        }),
        new deck.GeoJsonLayer({ //Добавление нового слоя с реками, полигон
            id: "citys",
            data: "./data/populated_places.geojson",
            filled: true,
            pointRadiusUnits: "pixels",
            getPointRadius: 6, 
            getFillColor: [50,30,119],
            //getLineColor: [92,39,89,36],
            lineWidthUnits: "pixels", // Единицы измерения ширины линии
            lineWidthScale: 0.3, // Масштаб ширины линии
            //getLineColor: [80,50,125]
            pickable: true, // Добавление интерактивности
            autoHighlight: true,
            onClick: (info, event) => {
                console.log(document.getElementById("name").innerText),
                document.getElementById("name").innerText = `Город ${info.object.properties.NAME}`}
            //onClick: (info, event) => console.log(info),//добавление записи
             //добавление интерактивности
        }),
    ]
});