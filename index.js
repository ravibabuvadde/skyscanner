const express = require('express');
const app = express();
const axios = require('axios');

app.get('/', (req, res) => {
    res.json({ error: 'No endpoint specified' });
});

app.get('/api', (req, res) => {
    res.json({ error: 'No endpoint specified' });
});

app.get('/api/flights', (req, res) => {
    const API_KEY = req.headers['x-rapidapi-key'] || req.query['x-rapidapi-key'];
    const API_HOST = req.headers['x-rapidapi-host'] || req.query['x-rapidapi-host'];
    const ORIGIN = req.query['origin'];
    const DESTINATION = req.query['destination'];
    const DEPARTURE_DATE = req.query['departureDate'];
    const CURRENCY = req.query['currency'];
    console.log(ORIGIN, DESTINATION, DEPARTURE_DATE, CURRENCY)

    if (!API_KEY || !API_HOST) {
        res.json({ error: 'Missing API key or host' });
    } else {
        const options = {
            method: 'GET',
            url: 'https://skyscanner44.p.rapidapi.com/search-extended',
            params: {
              adults: '1',
              origin: ORIGIN,
              destination: DESTINATION,
              departureDate: DEPARTURE_DATE,
              currency: CURRENCY,
              stops: '0',
              duration: '50',
              startFrom: '00:00',
              arriveTo: '23:59',
              returnStartFrom: '00:00',
              returnArriveTo: '23:59'
            },
            headers: {
              'X-RapidAPI-Key': '2d2afdb577mshe01b4387e962d72p133afajsn1ee23362cc2b',
              'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            let Quotes = [];
            let Places = [];
            let Carriers = [];
            let Currencies = [];
            let id = 0;
            response.data.itineraries.results.forEach((result) => {
                let allprices = result.pricing_options;
                // get pricing option that has minimum price
                var minprice = allprices.reduce(function(res, obj) {
                    return (obj.price.amount < res.price.amount) ? obj : res;
                });
                let quote = {
                    QuoteId: ++id,
                    MinPrice: minprice.price.amount,
                }
                let place = {
                    Name : result.legs[0].origin.name,
                    CountryName : result.legs[0].origin.displayCode
                }
                let carrier = {
                    CarrierId : result.legs[0].carriers.marketing[0].id,
                    Name : result.legs[0].carriers.marketing[0].name
                }
                let currency = {
                    Symbol : "Rs"
                }

                Quotes.push(quote);
                Places.push(place);
                Carriers.push(carrier);
                Currencies.push(currency);
            });

            // create json with above data
            let data = {
                Quotes: Quotes,
                Places: Places,
                Carriers: Carriers,
                Currencies: Currencies
            }
            res.json(data);


        }).catch(function (error) {
            console.error(error);
        });

    }


});


app.get('/api/places', (req, res) => {
    const API_KEY = req.headers['x-rapidapi-key'] || req.query['x-rapidapi-key'];
    const API_HOST = req.headers['x-rapidapi-host'] || req.query['x-rapidapi-host'];
    const COUNTRY = req.query['country'];
    const CURRENCY = req.query['currency'];
    const LOCALE = req.query['locale'];

    if (!API_KEY || !API_HOST) {
        res.json({ error: 'Missing API key or host' });

    } else {
        const options = {
            method: 'GET',
            url: 'https://skyscanner44.p.rapidapi.com/autocomplete',
            params: {
                query : COUNTRY
            },
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        };

        axios.request(options).then(function (response) {
            let Places = [];
            let id = 0;
            response.data.forEach((place) => {
                let pl = {
                    PlaceId: place.iata_code,
                    PlaceName: place.name,
                    CountryId: place.country,
                    CountryName: place.country,
                }
                Places.push(pl);
            });

            // create json with above data
            let data = {
                Places: Places
            }
            res.json(data);
        }).catch(function (error) {
            console.error(error);
        });
    }

});

app.get('/api/routes', (req, res) => {
    const API_KEY = req.headers['x-rapidapi-key'] || req.query['x-rapidapi-key'];
    const API_HOST = req.headers['x-rapidapi-host'] || req.query['x-rapidapi-host'];
    const ORIGIN = req.query['origin'];
    const DESTINATION = req.query['destination'];
    const DEPARTURE_DATE = req.query['departureDate'];
    const CURRENCY = req.query['currency'];

    if (!API_KEY || !API_HOST) {
        res.json({ error: 'Missing API key or host' });
    } else {
        const options = {
            method: 'GET',
            url: 'https://skyscanner44.p.rapidapi.com/search-extended',
            params: {
              adults: '1',
              origin: ORIGIN,
              destination: DESTINATION,
              departureDate: DEPARTURE_DATE,
              currency: CURRENCY,
              stops: '0',
              duration: '50',
              startFrom: '00:00',
              arriveTo: '23:59',
              returnStartFrom: '00:00',
              returnArriveTo: '23:59'
            },
            headers: {
              'X-RapidAPI-Key': '2d2afdb577mshe01b4387e962d72p133afajsn1ee23362cc2b',
              'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            let Quotes = [];
            let Places = [];
            let Carriers = [];
            let Currencies = [];
            let Routes = [];
            let id = 0;
            console.log(response.data);
            response.data.itineraries.results.forEach((result) => {
                let allprices = result.pricing_options;
                // get pricing option that has minimum price
                var minprice = allprices.reduce(function(res, obj) {
                    return (obj.price.amount < res.price.amount) ? obj : res;
                });
                let quote = {
                    QuoteId: ++id,
                    MinPrice: minprice.price.amount,
                }
                let place = {
                    Name : result.legs[0].origin.name,
                    CountryName : result.legs[0].origin.displayCode
                }
                let carrier = {
                    CarrierId : result.legs[0].carriers.marketing[0].id,
                    Name : result.legs[0].carriers.marketing[0].name
                }
                let currency = {
                    Symbol : "Rs"
                }

                let routes = {
                    QuoteDateTime: result.legs[0].departure,
                    Price : minprice.price.amount
                }

                Quotes.push(quote);
                Places.push(place);
                Carriers.push(carrier);
                Currencies.push(currency);
                Routes.push(routes);
            });

            // create json with above data
            let data = {
                Quotes: Quotes,
                Places: Places,
                Carriers: Carriers,
                Currencies: Currencies,
                Routes: Routes
            }
            res.json(data);


        }).catch(function (error) {
            console.error(error);
        });

    }


});



app.get('/api/datewiseflights', (req, res) => {
    const API_KEY = req.headers['x-rapidapi-key'] || req.query['x-rapidapi-key'];
    const API_HOST = req.headers['x-rapidapi-host'] || req.query['x-rapidapi-host'];
    const ORIGIN = req.query['origin'];
    const DESTINATION = req.query['destination'];
    const DEPARTURE_DATE = req.query['departureDate'];
    const RETURN_DATE = req.query['returnDate'];
    const CURRENCY = req.query['currency'];

    if (!API_KEY || !API_HOST) {
        res.json({ error: 'Missing API key or host' });
    } else {
        const options = {
            method: 'GET',
            url: 'https://skyscanner44.p.rapidapi.com/search-extended',
            params: {
              adults: '1',
              origin: ORIGIN,
              destination: DESTINATION,
              departureDate: DEPARTURE_DATE,
              returnDate: RETURN_DATE,
              currency: CURRENCY,
              stops: '0',
              duration: '50',
              startFrom: '00:00',
              arriveTo: '23:59',
              returnStartFrom: '00:00',
              returnArriveTo: '23:59'
            },
            headers: {
              'X-RapidAPI-Key': '2d2afdb577mshe01b4387e962d72p133afajsn1ee23362cc2b',
              'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            let Quotes = [];
            let Places = [];
            let Carriers = [];
            let Currencies = [];
            let Routes = [];
            let DepartureDates = [];
            let ReturnDates = [];
            let id = 0;
            console.log(response.data);
            response.data.itineraries.results.forEach((result) => {
                let allprices = result.pricing_options;
                // get pricing option that has minimum price
                var minprice = allprices.reduce(function(res, obj) {
                    return (obj.price.amount < res.price.amount) ? obj : res;
                });
                let quote = {
                    QuoteId: ++id,
                    MinPrice: minprice.price.amount,
                }
                let place = {
                    Name : result.legs[0].origin.name,
                    CountryName : result.legs[0].origin.displayCode
                }
                let carrier = {
                    CarrierId : result.legs[0].carriers.marketing[0].id,
                    Name : result.legs[0].carriers.marketing[0].name
                }
                let currency = {
                    Symbol : "Rs"
                }

                let routes = {
                    QuoteDateTime: result.legs[0].departure,
                    Price : minprice.price.amount
                }

                let departureDate = {
                    PartialDate: result.legs[0].departure,
                    Price : minprice.price.amount
                }

                let returnDate = {
                    PartialDate: result.legs[1].departure,
                    Price : minprice.price.amount
                }

                Quotes.push(quote);
                Places.push(place);
                Carriers.push(carrier);
                Currencies.push(currency);
                Routes.push(routes);
                DepartureDates.push(departureDate);
                ReturnDates.push(returnDate);
            });

            // create json with above data
            let data = {
                Quotes: Quotes,
                Places: Places,
                Carriers: Carriers,
                Currencies: Currencies,
                Routes: Routes,
                DepartureDates: DepartureDates, 
                ReturnDates: ReturnDates
            }
            res.json(data);


        }).catch(function (error) {
            console.error(error);
        });

    }


});


app.get('/api/countries', (req, res) => {
    const API_KEY = req.headers['x-rapidapi-key'] || req.query['x-rapidapi-key'];
    const API_HOST = req.headers['x-rapidapi-host'] || req.query['x-rapidapi-host'];
    const COUNTRY = req.query['country'];
    if (!API_KEY || !API_HOST) {
        res.json({ error: 'Missing API key or host' });
    } else {
        const options = {
            method: 'GET',
            url: 'https://codesofcountry.p.rapidapi.com/countries',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        };

        axios.request(options).then(function (response) {
            res.json(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});