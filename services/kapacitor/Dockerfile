FROM poolmon/tickbase:latest
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y kapacitor
COPY kapacitor.conf /etc/kapacitor/kapacitor.conf

EXPOSE 9092
VOLUME ["/etc/kapacitor", "/var/lib/kapacitor", "/var/log/kapacitor"]

CMD /usr/bin/kapacitord

