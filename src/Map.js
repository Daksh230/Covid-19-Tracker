import React, { useRef, useEffect } from "react";
import { Circle, MapContainer as LeafletMap, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "./Map.css";
import numeral from "numeral";
import { green } from "@material-ui/core/colors";


const casesTypeColors = {
  cases: {
    hex: "#B22222",
    multiplier: 400,
  },

  recovered: {
    hex: "#228B22",
    multiplier: 800,
  },

  deaths: {
    hex: "#fb4443",
    multiplier: 1400,
  },
};



function MyComponent({ countries, center, zoom }) {

  let map = useMap();
  map.flyTo(center, zoom)

  return (
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />

  )
}

function Map({ casesType, countries, center, zoom }) {

console.log(casesType)

  return (
    <div className="map">
      <LeafletMap countries={countries} center={center} zoom={zoom} >
        <MyComponent countries={countries} center={center} zoom={zoom} />

        {

          countries.map((country) => (
            
            <Circle center={[country.countryInfo.lat, country.countryInfo.long]}
              fillOpacity={0.4}
              color={casesTypeColors[casesType].hex}
              fillcolor={casesTypeColors[casesType].hex}
              radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}>
              
              <Popup>
                <div className="info-container">
                  <div className="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})` }} />

                  <div className="info-name">{country.country}</div>
                  <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                  <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                  <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
              </Popup>
            
            </Circle>
          ))
        }

      </LeafletMap>
    </div>
  );
}

export default Map;
