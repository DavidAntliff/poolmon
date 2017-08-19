FROM resin/rpi-raspbian:jessie
MAINTAINER David Antliff <david.antliff@gmail.com>

# apt-transport-https required for https repositories
RUN apt-get update && apt-get install -y wget apt-transport-https

RUN wget -q -O - https://repos.influxdata.com/influxdb.key | apt-key add -
RUN echo "deb https://repos.influxdata.com/debian jessie stable" | tee /etc/apt/sources.list.d/influxdb.list

RUN apt-get update

