
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

const setDeparture = () => {
    document.getElementById('departure').setAttribute(
        'placeholder', newDate
    );
}

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
        })
        .catch(error => {
            console.log('error:', error);
        })
    }
}

export { setDeparture, formHandler }

// GET ROUTE: retrieve project data
const getProjectData = async (url='') => {
    const res = await fetch(url);
    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
}

// GET ROUTE: retrieve weather data
const getWeather = async (url='') => {
    const res = await fetch(url);
    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
}

// POST ROUTE: upload weather data
const postWeather = async (url='', data={}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
}


// generate button callback function
const performAction = (event) => {
    const zip = document.getElementById('zip').value;
    console.log('zip', zip)
    const response = document.getElementById('feelings').value;
    getWeather(baseURL + zip + apiKey)
    .then(data => {
        // catch up unexist zip code
        if (data.cod === '404') {
            alert('Invalid zip code. City not found.')
            throw 'city not found';
        }
        const postData = {
            temperature: data.main.temp,
            date: newDate,
            response: response
        };
        postWeather('/addWeather', postData);
    })
    .then(() => {
        updateUI();
    });
}

// function for update UI with fetched project data
const updateUI = async () => {
    getProjectData('/all')
    .then(data => {
        document.getElementById('temp').innerHTML = '<sapn>Temp:</span> ' + data.temperature + ' &deg;C';
        document.getElementById('date').innerHTML = '<span>Date:</span> ' + data.date;
        document.getElementById('content').innerHTML = '<span>Your Feeling:</span> ' + data.response;
    });
}


// add click event listener on generate button
// document.getElementById('generate').addEventListener('click', performAction);
