# Pool Temperature Monitoring Project

This is a personal project to deliver temperature data from several DS18B20 temperature sensors, connected via
an ESP32-based embedded system, to a web-based dashboard.

It currently consists of a MQTT Broker (Mosquitto), Telegraf (acting as an MQTT Consumer), InfluxDB,
Chronograf and Kapacitor (the so-called [TICK](https://www.influxdata.com/time-series-platform/) stack).

In this initial version of the project, the services required are running on a Raspberry Pi 3, via Docker.

## Dependencies

Docker Compose:

    $ pip install docker-compose

## Building

To build all the docker containers:

    $ cd services
    $ docker-compose build

## Running

To start the stack (`--force-recreate` used to ensure fresh containers):

    $ cd services
    $ docker-compose -p poolmon up --force-recreate

Hit CTRL-C to terminate the stack. You can then bring it back up with the `up` command immediately, or shut\
it down entirely (to create new containers on next up) with:

    $ docker-compose -p poolmon down

If changes are made to a Dockerfile, you can rebuild the images and restart only the changed services with:

    $ docker-compose -p poolmon up -d --build

## Interfaces

Access the Chronograf interface via HTTP on port 8888.

You can use an embedded device to publish data via MQTT, or use [mqtt-spy](http://kamilfb.github.io/mqtt-spy/)
to publish data and monitor your topics. Scripts can be used to automate publishing data, such as simulating
temperature measurement data.

## Roadmap

* Add [Grafana](https://grafana.com/) to the TICK stack.
* Get ESP32 talking MQTT.
* Enable MQTT security.
* Enable InfluxDB security.

## Acknowledgements

* [rpi-mosquitto](https://github.com/pascaldevink/rpi-mosquitto.git) - Pascal de Vink
* [influxdata/TICK-docker](https://github.com/influxdata/TICK-docker/blob/master/1.2/docker-compose.yml)
* [influxdata/sandbox](https://github.com/influxdata/sandbox/blob/master/docker-compose.yml)
* [influxdata/influxdata-docker](https://github.com/influxdata/influxdata-docker)

