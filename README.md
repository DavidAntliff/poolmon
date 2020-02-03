# Pool Temperature Monitoring Project

This is a personal project to deliver temperature data from several DS18B20 temperature sensors, connected via
an [ESP32-based embedded system](https://github.com/DavidAntliff/esp32-poolmon), to a web-based dashboard.

It currently consists of a MQTT Broker (Mosquitto), Telegraf (acting as an MQTT Consumer), InfluxDB,
Chronograf and Kapacitor (the so-called [TICK](https://www.influxdata.com/time-series-platform/) stack).
Grafana is used for dashboard visualisation.

In this initial version of the project, the services required are running on a Raspberry Pi 3, via Docker.

## Raspberry Pi Setup

Download Raspbian Stretch Lite from [here](https://www.raspberrypi.org/downloads/raspbian/).

Flash this to at least an 8GB microSD card. [Etcher](http://etcher.io) works well (and verifies), or use `dd`.

Mount the microSD card and create the empty file `ssh` - this will enable the SSH server on boot.

Also create `wpa_supplicant.conf` with the following content, modified for your circumstances:

```
country=NZ
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="YourWifiSSID"
    psk="YourWifiSecretKey"
    key_mgmt=WPA-PSK
}
```

The `ctrl_interface` line seems necessary to work around an issue with Stretch and wireless interface naming.

Power up the Raspberry Pi - if you have DHCP on your network, it should appear with the name 'raspberrypi'.

SSH to the RPi as user "pi" with password "raspberry":

`ssh pi@raspberrypi`

Check that your previous `wpa_supplicant.conf` file has been automatically copied to `/etc/wpa_supplicant/wpa_supplicant.conf` and that the contents is correct.

Update the system with:

    $ sudo apt-get update
    $ sudo apt-get dist-upgrade

Configure the RPi with `sudo raspi-config` and ensure:

 - 8 Update - should already be the latest, but just to be sure!
 - 3 Boot Options > B1 Desktop / CLI > B1 Console - Text console, requiring user to login
 - 5 Interfacing Options > P2 SSH > Yes - Enable SSH Server
 - 7 Advanced Options > A1 Expand Filesystem

Then choose "Finish" and opt to reboot the RPi.

Check that it comes back up and that you can ssh into it.




### Docker

The `curl -sSL https://get.docker.com | sh` trick seems to be deprecated and no longer works as of August 2017.

Instead, follow the directions presented [here](https://docs.docker.com/engine/installation/linux/docker-ce/debian/#install-using-the-repository).

That is:

```
$ sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
# Verify key is 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88
$ echo "deb [arch=armhf] https://download.docker.com/linux/debian \
     $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
$ sudo apt-get update
$ sudo apt-get install raspberrypi-kernel-headers docker-ce
$ sudo addgroup pi docker
```

Note: January 2019: 18.09.03 seems to be [broken](https://github.com/moby/moby/issues/38175#issuecomment-438201988). Use 18.06.1 instead:

```
sudo apt-get install docker-ce=18.06.1~ce~3-0~raspbian
```

Log out and then back in, and verify that Docker is correctly installed:

```
$ docker run armhf/hello-world

Hello from Docker on armhf!
This message shows that your installation appears to be working correctly.
...
```

### Docker Compose

There are various ways to install Docker Compose. I found `pip` to be the easiest and most up to date.

    $ sudo apt-get install python-pip
    $ sudo pip install docker-compose

Install bash autocompletion with:

    $ sudo curl -L https://raw.githubusercontent.com/docker/compose/$(docker-compose version --short)/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose

## Cloning

Install `git` and clone the project:

    $ sudo apt-get install git
    $ git clone https://github.com/DavidAntliff/poolmon.git
    $ cd poolmon

## Building

To build all the docker containers:

    $ cd services
    $ docker-compose build

## Running

    $ cd services

To start the stack (`--force-recreate` can be used to ensure fresh containers):

    $ docker-compose up -d

Shut the stack down entirely (to create new containers on next up) with:

    $ docker-compose down

If changes are made to a Dockerfile, you can rebuild the images and restart only the changed services with:

    $ docker-compose up -d --build

Optionally specify the service name:

    $ docker-compose up -d --build kapacitor

## InfluxDB

THe influxdb server is called _influxdb_ and it is accessible from the RPi itself.

Check influxdb is running:

```curl -I http://localhost:8086/ping```

Command-line access to influxdb:

```docker run -it --rm --network poolmon_default poolmon/influxdb influx -host influxdb```

### Useful Queries

```> show databases```

The database automatically created and populated by telegraf is called `telegraf`:

```> use telegraf```

Show all available measurements:

```> show measurements```

The mqtt topics that telegraf subscribes to are stored in `mqtt_consumer`.

Set the time format:

```> precision rfc3339```

Obtain last hour of readings from temp sensor 2:

```> select "value" from "mqtt_consumer" where "topic" = 'poolmon/sensors/temp/2/value' and time < now() - 1h```

## Interfaces

### MQTT

You can use an embedded device to publish data via MQTT, or use [mqtt-spy](http://kamilfb.github.io/mqtt-spy/)
to publish data and monitor your topics. Scripts can be used to automate publishing data, such as simulating
temperature measurement data.

### Chronograf

Access the Chronograf interface via HTTP on port 8888.

### Grafana

Access the Grafana interface via HTTP on port 3000.

Add the InfluxDB instance (`http://influxdb:8086`) via Proxy access, and select database `telegraf`.

Dashboards can be easily exported (saved to JSON file) or imported.

## TICKscripts

Kapacitor uses TICKscripts to process streams of incoming data. These can be managed by the `kapacitor` program within
the kapacitor-cli or kapacitor containers. Run `bin/kapacitor-cli` to access the former.

To register a TICKscript against a database & retention policy:

    $ kapacitor define <task_name> -type stream -tick <tick_script> -dbrp <database.rp>

For example:

    $ kapacitor define cpu_alert -type stream -tick cpu_alert.tick -dbrp telegraf.autogen

To redefine a script after it has been modified:

    $ kapacitor define <task_name> -tick <tick_script>

For example:

    $ kapacitor define cpu_alert -tick cpu_alert.tick

To enable a stream:

    $ kapacitor enable <task_name>

To disable a stream:

    $ kapacitor disable <task_name>

To record a stream:

    $ kapacitor record stream -task <task_name> -duration <duration>

This returns a recording ID. Use it as <rid> below.

To replay the stream through the task:

    $ kapacitor replay -recording <rid> -task <task_name>

To see all recordings:

    $ kapacitor list recordings

To see kapacitor processing stats:

    $ kapacitor stats ingress

To see all defined tasks (enabled or disabled):

    $ kapacitor list tasks

To examine a specific task:

    $ kapacitor show <task_name>

To record a stream for a time range (note the 's' suffix for second precision):

    $ kapacitor record query -type stream \
	    -query $'select * from "<db>"."<rp>"."<measurement1>" \
		         where time >= 1504000000s and time <= 1504000070s'

To record multiple streams withina time range simulataneously:

    $ kapacitor record query -type stream \
	    -query $'select * from "<db>"."<rp>"."<measurement1>" \
		         where time >= 1504000000s and time <= 1504000070s; \
				 select * from "<db>"."<rp>"."<measurement2>" \
				 where time >= 1504000000s and time <= 1504000170s'

## Tweaks

* Edit `/etc/docker/daemon.json` and disable Docker logging (to save SD card writes):

```
{
  "log-driver": "none"
}
```

Restart docker and all containers for the change to take effect.

## Roadmap

* Enable MQTT security.
* Enable InfluxDB security.
* Add control panel for controlling ESP32 via web.

## Acknowledgements

* [rpi-mosquitto](https://github.com/pascaldevink/rpi-mosquitto.git) - Pascal de Vink
* [influxdata/TICK-docker](https://github.com/influxdata/TICK-docker/blob/master/1.2/docker-compose.yml)
* [influxdata/sandbox](https://github.com/influxdata/sandbox/blob/master/docker-compose.yml)
* [influxdata/influxdata-docker](https://github.com/influxdata/influxdata-docker)

