# homebridge-wakeonlan
Wake on LAN plugin for homebridge: https://github.com/nfarina/homebridge

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-wakeonlan
3. Update your configuration file. See the sample below.

# Configuration

Configuration sample:

 ```
"accessories": [
  {
    "accessory": "WakeOnLan",
    "name": "Desktop",
    "macAddress": "BC:5D:F4:C8:5A:5F",
    "ipAddress": "192.168.1.212"
  }
]

```

The ipAddress is optional. If supplied then the on status is checked by pinging this IP Address. Pinging is done using ping -c 1 <ipaddress>. This probably only works on unix.
