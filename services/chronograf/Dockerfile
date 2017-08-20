FROM poolmon/tickbase:latest
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y chronograf

EXPOSE 8888
VOLUME /var/lib/chronograf

CMD /usr/bin/chronograf

