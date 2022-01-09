const bme280 = require('bme280');

const format = number => (Math.round(number * 100) / 100).toFixed(2);
const delay = millis => new Promise(resolve => setTimeout(resolve, millis));

const reportData = async () => {

    const sensor = await bme280.open({
		i2cBusNumber: 1,
		i2cAddress: 0x77,
		humidityOversampling: bme280.OVERSAMPLE.X1,
		pressureOversampling: bme280.OVERSAMPLE.X16,
		temperatureOversampling: bme280.OVERSAMPLE.X2,
		filterCoefficient: bme280.FILTER.F16
    });

    const reading = await sensor.read();
    
    /* console.log(
		`${format(reading.temperature)}°C, ` +
		`${format(reading.pressure)} hPa, ` +
		`${format(reading.humidity)}%`
    ); */

    await sensor.close();

    return reading;
};

// reportData().catch(console.log);

module.exports = reportData;