module.exports = init;

var wol = require('wake_on_lan');
var exec = require('child_process').exec;
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
  this.ipAddress = config.ipAddress;
  this.name = config.name;

  if (!this.macAddress) throw new Error('MacAddress property must be defined');
}

WakeOnLan.prototype = {
	
  ping: function(ipAddress, callback) {
	  exec("ping -c 1 " + ipAddress, function(error, stdout, stderr) {
		if (error) {
			callback(false);
		} else {
			callback(true);
		} 
	  });
  },

  setPowerState: function(powerOn, callback) {
    var log = this.log;

	if (powerOn === true) {
      log("sending magic packet to " + this.name + "(" + this.macAddress + ")");
      wol.wake(this.macAddress, function(error) {
        if (error) {
          log('packet not sent');
        } else {
          log('packet sent successfully');
        } 
        callback(error);
      });
	} else {
      log("ignoring request to turn off " + this.name + "(" + this.macAddress + ")");
	  callback(true);
	}	

  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },
  
  getPowerState: function(callback) {
	var log = this.log;
	var ipAddress = this.ipAddress;
	var name = this.name;
	if (ipAddress) {
		log("requested on state for " + name + "(" + ipAddress + ")");
		this.ping(ipAddress, function(ok) {
			if (ok) {
				log(name + " is on");
				callback(null,1);
			} else {
				log(name + " is off");
				callback(null,0);
			}
		});
    } else {
		log("ipAddress not supplied for " + name + " so assuming device off");
		callback(null,0);
    }
  },

  getServices: function() {

    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "WOL")
      .setCharacteristic(Characteristic.Model, "Wake On Lan")
      .setCharacteristic(Characteristic.SerialNumber, "1337");

    var switchService = new Service.Switch(this.name);

    switchService.getCharacteristic(Characteristic.On)
	  .on('get', this.getPowerState.bind(this))
      .on('set', this.setPowerState.bind(this));

    return [informationService, switchService];
  }
};
