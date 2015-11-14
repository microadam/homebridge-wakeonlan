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
    "macAddress": "BC:5D:F4:C8:5A:5F"
  }
]

```
