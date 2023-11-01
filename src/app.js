const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const getLocationData = require('./utils/ip');


const app = express()

// Mendefinisikan jalur/path untuk konfigurasi Express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')

// Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)

// Setup direktori statis
app.use(express.static(direktoriPublic))


// Ini adalah Website One Page Weather Check
app.get('', (req, res) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('IP Address:', ipAddress); // Menampilkan alamat IP di konsol server
    getLocationData(ipAddress, (error, data) => {
        if (error) {
            return res.send({ error });
        }
        res.render('index', {
            ipAddress: data.ip,
            country: data.country_name,
            region: data.region_name,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });
});


app.get('/infocuaca', (req, res) => {
    if(!req.query.address)
    {
        return res.send
        ({
            error:'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => 
    {
        if (error)
        {
        return res.send({error})
    }
    forecast(latitude, longitude, (error, dataPrediksi) => {
        if (error)
        {
            return res.send({error})
        }
        res.send({prediksiCuaca: dataPrediksi,lokasi: location,address: req.query.address})
        })
    })
})


app.get('*', (req, res) => {
    res.render('404', {
    judul: '404',
    })
})


app.listen(4000, () => {
    console.log('Server berjalan pada port 4000.')
})