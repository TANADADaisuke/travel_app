// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

const setDeparture = () => {
    document.getElementById('departure').setAttribute(
        'placeholder', newDate
    );
}

// get all trips from server
const getTrips = async (url='http://localhost:8080/trip') => {
    const res = await fetch(url);
    try {
        const data = await res.json();
        for (let i = 0; i < data.trip.length; i++) {
            updateUI(data.trip[i]);
        }
    } catch(error) {
        console.log('error:', error);
    }
}

// submit button callback function
const formHandler = async (event) => {
    event.preventDefault();

    // check the input values
    let destination = document.getElementById('destination').value
    let departure = document.getElementById('departure').value

    if (destination == '') {
        alert('Destination is empty! Please fill in the form.');
    } else if (departure == '') {
        alert('Departure is empty! Please fill in the form.')
    } else {
        console.log('::: Form submitted :::');
        await fetch('http://localhost:8080/form' , {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: destination,
                departure: departure
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log('::: Response :::\n', res);
            updateUI(res);
        })
        .catch(error => {
            console.log('error:', error);
        })
    }
}

// function for update UI with fetched project data
const updateUI = (res) => {
    // create new trip element
    const newTrip = document.createElement('section');
    newTrip.className = 'trip';
    newTrip.setAttribute('data-id', res.id);

    // append photo section
    const photoSection = document.createElement('section');
    photoSection.className = 'photo-section';
    // set background style
    photoSection.style.background = `url(${res.photourl})`;
    photoSection.style.backgroundSize = 'cover';
    photoSection.style.backgroundRepeat = 'no-repeat';
    photoSection.style.backgroundPosition = 'center';
    newTrip.appendChild(photoSection);

    // append trip section
    const tripSection = document.createElement('section');
    tripSection.className = 'trip-section';
    newTrip.appendChild(tripSection);

    // create description area in trip section
    const description = document.createElement('section');
    description.className = 'description';
    // trip title
    const tripTitle = document.createElement('div');
    tripTitle.className = 'trip-title';
    tripTitle.textContent = 'My Travel to ' + res.destination + ', ' + res.countryName;
    // departing
    const departing = document.createElement('div');
    departing.className = 'departing';
    const departure = res.departure.split('T')[0].split('-');
    departing.textContent = 'Departing: ' + departure[2] + '/' + departure[1] + '/' + departure[0] + '/';
    // append elements
    description.appendChild(tripTitle);
    description.appendChild(departing);
    tripSection.appendChild(description);

    // button area
    const buttonArea = document.createElement('section');
    buttonArea.className = 'button-area';
    // remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.textContent = 'remove trip';
    removeButton.setAttribute('data-id', res.id);
    // add event listener
    removeButton.addEventListener('click', removeAction);
    // append elements
    buttonArea.appendChild(removeButton);
    tripSection.appendChild(buttonArea);

    // response area
    const responseArea = document.createElement('section');
    responseArea.className = 'response-area';
    // countdown
    const countdown = document.createElement('div');
    countdown.className = 'forward';
    countdown.innerHTML = res.destination + ', ' + res.countryName + ' is <span id="forward">' + res.countdown + '</span> days away';
    responseArea.appendChild(countdown);
    // weather
    if (res.countdown < 7) {
        // show weather forecast
        const weatherTitle = document.createElement('div');
        weatherTitle.className = 'weather';
        weatherTitle.textContent = 'Weather forecast:'
        responseArea.appendChild(weatherTitle);
        // forecast entry
        for (let i =0; i < 7; i++) {
            // weather entry
            const forecast = document.createElement('section');
            forecast.className = 'forecast';
            // set date
            const validDate = document.createElement('div');
            validDate.className = 'valid-date';
            validDate.textContent = res.weather[i].valid_date;
            // set temperature
            const temperature = document.createElement('div');
            temperature.className = 'temperature';
            temperature.innerHTML = '<span>High - ' + res.weather[i].high_temp + '&#8451;, Low - ' + res.weather[i].min_temp + '&#8451;</span>';
            // set weather
            const weather = document.createElement('div');
            weather.className = 'weather';
            weather.textContent = res.weather[i].weather.description;
            // append elements
            forecast.appendChild(validDate);
            forecast.appendChild(temperature);
            forecast.appendChild(weather);
            // show weather forecast
            responseArea.appendChild(forecast);
        }
    } else {
        // show typical weather
        const typical = document.createElement('div');
        typical.className = 'weather';
        typical.textContent = 'Typical weather:';
        // temperature
        const temperature = document.createElement('div');
        temperature.className = 'temperature';
        temperature.innerHTML = '<span>High - ' + res.weather[0].high_temp + '&#8451;, Low - ' + res.weather[0].min_temp + '&#8451;</span>';
        // weather
        const weather = document.createElement('div');
        weather.className = 'weather';
        weather.textContent = res.weather[0].weather.discription;
        // append elements
        responseArea.appendChild(typical);
        responseArea.appendChild(temperature);
        responseArea.appendChild(weather);
    }
    // append response area into trip section
    tripSection.appendChild(responseArea);

    // append new trip element
    document.querySelector('#trip-plan').appendChild(newTrip);
}

// remove button callback function
const removeAction = (event) => {
    // remove trip entry
    const tripId = event.target.getAttribute('data-id');
    const data = {
        'action': 'remove',
        'dataId': tripId
    }
    removeTrip(tripId, data);
}

const removeTrip = async (tripId, data, url='http://localhost:8080/remove') => {
    console.log('::: Remove action: trip' + tripId + ' :::');
    const res = await fetch(url,  {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (res.success === true) {
            // remove trip entry
            const trips = document.getElementsByClassName('trip');
            for (let i = 0; i < trips.length; i++) {
                if (trips[i].getAttribute('data-id') === tripId) {
                    trips[i].remove();
                }
            }
        }    
    })
    .catch(error => {
        console.log('error:', error);
    })
}

export { setDeparture, getTrips, formHandler }
