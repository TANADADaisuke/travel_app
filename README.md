# Travel App Project

## Overview

This project is a final capstone of Udacity's [Front End Web Developer](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011) nanodegree course. Travel app helps you to raise your motivation for trip, and planing with Travel app helps you to plan your trip with weather forcast and the image of the location where you want to go.

## Prerequesite

This application will use the following three APIs. Prepare accounts for each API and save it in `.env` file as local credential.
Also, you need `Node.js` to run this applicaiton, so if you do not have it, you need to install it.

### APIs

- [Geonames](http://www.geonames.org/export/web-services.html)
- [Weatherbit](https://www.weatherbit.io/account/create)
- [Pixabay](https://pixabay.com/api/docs/)

### Local credential file

Create `.env` file directly under your root project folder and  save each api key as follow.

```
GEONAMES_ID=*****************
WEATHERBIT_API_KEY=*******************
PIXABAY_KEY=*****************
```

## Launch Application

Once you clone or download this repository, follow the instruction bellow.

1. Install dependencies

  In your project folder, install all depencendies:
  ```
  npm install
  ```

2. run dev-server

  You can run dev-server with following command:
  ```
  npm run build-dev
  ```

3. run prod-server

  First, you have to prepare `dist` folder by running:
  ```
  npm run build-prod
  ```
  Then, you can start your prod-server with following command:
  ```
  npm run start
  ```

## How to use Travel App

Once you launch your Travel App, you can see submit form which contains `Destination` and `Departure` entry. Enter your destination and departure, and click `Go ahead`.
It will take a while and you can see your new trip under 'Your Trip Plan' section. Your trip plan contains the following infromation.
- Your destination
- Departure
- Remaining date
- Weather forecast

Also, you can remove your trip by clicking `remove trip` button in case you want to re-plan your trip.

Thanks and have a nice trip!