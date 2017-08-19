# Refer https://github.com/influxdata/influxdata-docker/blob/master/influxdb/1.3/Dockerfile

FROM tick-base:latest
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y influxdb
COPY influxdb.conf /etc/influxdb/influxdb.conf

EXPOSE 8086
VOLUME /var/lib/influxdb

CMD /usr/bin/influxd
