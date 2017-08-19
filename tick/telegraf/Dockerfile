FROM tick-base:latest
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y telegraf
COPY telegraf.conf /etc/telegraf/telegraf.conf

EXPOSE 8125/udp 8092/udp 8094
VOLUME /etc/telegraf/telegraf.conf

CMD /usr/bin/telegraf
