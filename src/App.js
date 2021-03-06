import { CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import React,{useState, useEffect} from 'react';
import Infobox from './Infobox';
import {Card} from '@material-ui/core';
import Map from './Map'
import Table from './Table'
import {sortData} from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from "./util"

function App() {
  
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState('')
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] =useState([]);
  const [casesType, setCasesType] = useState('cases');
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then((data)=>{
        setCountryInfo(data);
    })
    
  }, [])

  useEffect(() => {
    const getCountriesData = async()=>{
      fetch('https://disease.sh/v3/covid-19/countries')
      .then((response)=> response.json())
      .then((data)=>{
        
        const countries = data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2,
        }));

        let sortedData = sortData(data);
        setMapCountries(data);
        console.log(sortedData)
        setTableData(sortedData);
        setCountries(countries);
      });

    };


    getCountriesData();
  }, []);
 
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
        await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        console.log("COuntry code")
        setCountryInfo(data);
        countryCode==="worldwide"?setMapCenter([ 34.80746, -40.4796 ]):setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode==="worldwide"?setMapZoom(3):setMapZoom(5);
      });
  };


  return (
  <div className="app">

    <div className="app__left">
      <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        
      
        <div className='app__stats'>
          <Infobox isRed active={casesType==='cases'} onClick={e=>setCasesType('cases')} title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <Infobox active={casesType==='recovered'} onClick={e=>setCasesType('recovered')} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <Infobox isRed active={casesType==='deaths'} onClick={e=>setCasesType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
    </div>

    <Card className="app__right">
            <CardContent>
              <h2>Live Cases by Country</h2>
              <Table countries={tableData} />
              <h2 className="app__graph-title">Worldwide new {casesType}</h2>
              <LineGraph className="app__graph" casesType={casesType}/>
            </CardContent>
    </Card>

  </div>
  );
}

export default App;
