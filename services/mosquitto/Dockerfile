# Derived from Pascal de Vink's work at https://github.com/pascaldevink/rpi-mosquitto.git

FROM resin/rpi-raspbian:jessie
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y wget

RUN wget -q -O - http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key | apt-key add -
RUN wget -q -O /etc/apt/sources.list.d/mosquitto-jessie.list http://repo.mosquitto.org/debian/mosquitto-jessie.list
RUN apt-get update && apt-get install -y mosquitto

#RUN adduser --system --disabled-password --disabled-login mosquitto

COPY config /mqtt/config
COPY run.sh /run.sh

EXPOSE 1883 9001
VOLUME ["/mqtt/config", "/mqtt/data", "/mqtt/log"]

#CMD /usr/sbin/mosquitto -c /mqtt/config/mosquitto.conf
CMD ["/run.sh"]
