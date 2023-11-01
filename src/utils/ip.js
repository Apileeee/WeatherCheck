const request = require('postman-request');

const getLocationData = (ipAddress, callback) => {
    const accessKey = '223c80cdecefaa04d1c1ec9bcffc22f4';
    const url = `http://api.ipstack.com/${ipAddress}?access_key=${accessKey}`;

    request({ url, json: true }, (error, response, body) => {
        if (error) {
            callback('Terjadi kesalahan saat mengambil data lokasi dari API', undefined);
        } else if (body.error) {
            callback('Tidak dapat menemukan lokasi untuk alamat IP yang diberikan', undefined);
        } else {
            const locationData = {
                ip: body.ip,
                country_name: body.country_name,
                region_name: body.region_name,
                city: body.city,
                latitude: body.latitude,
                longitude: body.longitude
            };
            console.log(locationData); // Menampilkan data lokasi di konsol
            callback(undefined, locationData);
        }
    });
};

module.exports = getLocationData;
