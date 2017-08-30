FROM resin/rpi-raspbian:jessie
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y wget apt-transport-https

RUN wget -q -O - https://bintray.com/user/downloadSubjectPublicKey?username=bintray | apt-key add -
RUN echo "deb https://dl.bintray.com/fg2it/deb jessie main" | tee /etc/apt/sources.list.d/grafana.list

RUN apt-get update && apt-get install grafana
COPY run.sh /run.sh

EXPOSE 3000
VOLUME ["/var/lib/grafana", "/var/log/grafana", "/etc/grafana"]

#CMD ["/usr/sbin/grafana-server", "-config", "/etc/grafana/grafana.ini", "-homepath", "/usr/share/grafana"]
CMD ["/run.sh"]
