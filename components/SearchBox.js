import React, { useState } from 'react'
import cities from "../lib/city.list.json";
export default function SearchBox({placeholder}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [index, setIndex] = useState(0)

    const setSuggestHandler = (name, country) =>{
        setQuery(name)
        setResults([])
        document.location = "/location/"+name
        setIndex(0)
      }
    const onChangeHandler = (text)=>{
        var matches = []
        var topten  = []
        if (text.length>0) {
          matches = cities.filter((city) => {
            return city.name.toLowerCase().startsWith(text.toLowerCase());
          });
          topten = matches.slice(0, 10);
        }
        if(index >= topten.length){
          setIndex(0)
        }
        setResults(topten)
        setQuery(text)
      }
      const handleCheckKey = (e) =>{
        if(results.length>0){
          if(e.keyCode === 38){
            if(index > 0){
              setIndex(index-1)
            }
          }else if (e.keyCode === 40){
            if(index < results.length-1){
              setIndex(index+1)
            }
          }else if(e.keyCode === 13){
            setSuggestHandler(results[index].name, results[index].country)
          }
        }
      }
  return (
    <div className='search'>
        <input type={"text"} value={query}
            placeholder={placeholder ? placeholder : ""}
            onKeyDown={handleCheckKey}
            onChange={e => onChangeHandler(e.target.value)} />
        {results.length > 0 && (
            <ul>
                {results.map((city, i) => (
                  <li key={city.slug}
                    style={index === i ? {backgroundColor:'#DDD'} : {backgroundColor:'#FFF'}}
                    onClick={()=> setSuggestHandler(city.name, city.country)}>
                      {city.name}
                      <span> ({city.country})</span>
                  </li>
                ))}
            </ul>
        )}
    </div>
  )
}
