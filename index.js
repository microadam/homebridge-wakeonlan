module.exports = init;

var wol = require('wake_on_lan');
var Service = null;
var Characteristic = null;


function init(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-wakeonlan', 'WakeOnLan', WakeOnLan);
}

function WakeOnLan(log, config) {
  this.log = log;
  this.macAddress = config.macAddress;
  this.name = config.name;

  if (!this.macAddress) throw new Error('MacAddress property must be defined');
}

WakeOnLan.prototype = {

  setPowerState: function(powerOn, callback) {
    var log = this.log;

    log("sending magic packet...");
    wol.wake(this.macAddress, function(error) {
      if (error) {
        log('packet not sent');
      } else {
        log('packet sent successfully');
      }
      callback(error);
    });

  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "WOL")
      .setCharacteristic(Characteristic.Model, "Wake On Lan")
      .setCharacteristic(Characteristic.SerialNumber, "1337");

    var switchService = new Service.Switch(this.name);

    switchService.getCharacteristic(Characteristic.On)
      .on('get', function (callback) {
        callback(null, 0);
      })
      .on('set', this.setPowerState.bind(this));

    return [informationService, switchService];
  }
};
