import Head from 'next/head';
import React from 'react'
import cities from "../../lib/city.list.json";
import TodaysWeather from '../../components/TodaysWeather';
import moment from 'moment-timezone';
import HourlyWeather from '../../components/HourlyWeather';
import WeeklyWeather from '../../components/WeeklyWeather';
import SearchBox from '../../components/SearchBox';
export async function getServerSideProps(context) {
    const city = getCity(context.params.city);
    if(!city){
        return {
            notFound: true,
        };
    };
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if(!data){
        return {
            notFound: true,
        };
    };
    const slug = context.params.city;

    return{
        props: {
            city: city,
            cuttentWeather: data.current,
            dailyWeather: data.daily,
            hourlyWeather: getHourlyWeather(data.hourly, data.timezone),
            timezone: data.timezone_offset
        },
    }
}

const getCity = name => {
    const city = cities.find(city => city.name == name);
    if (city){
        return city;
    } else{
        return null;
    }
}

const getHourlyWeather = (hourlyData, timezone) => {
    const endOfDay = moment().tz(timezone).endOf('day').valueOf();
    const endTimeStamp = Math.floor(endOfDay/1000);
    const todayData = hourlyData.filter(data => data.dt < endTimeStamp);

    return todayData;
}
export default function City({
    hourlyWeather,
    cuttentWeather,
    dailyWeather,
    city,
    timezone
}) {
    console.log(city);
    return (
        <div>
        <Head>
            <title>{city.name} Weather - Next Weather App</title>
        </Head>
            <div className='page-wrapper'>
                <div className='container'>
                    <SearchBox placeholder="Search for another location..."/>
                    <TodaysWeather city={city} weather={dailyWeather[0]} timezone={timezone}/>
                    <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone}/>
                    <WeeklyWeather weeklyWeather={dailyWeather} timezone={timezone} />
                </div>
            </div>
        </div>
    );
}
