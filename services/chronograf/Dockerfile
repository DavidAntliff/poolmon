FROM poolmon/tickbase:latest
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y chronograf

EXPOSE 8888
VOLUME /var/lib/chronograf
#VOLUME ["/usr/share/chronograf", "/var/lib/chronograf"]

CMD ["/usr/bin/chronograf", "-b", "/var/lib/chronograf/chronograf-v1.db"]
#CMD ["/usr/bin/chronograf", "-b", "/var/lib/chronograf/chronograf-v1.db", "-c", "/usr/share/chronograf/canned"]

