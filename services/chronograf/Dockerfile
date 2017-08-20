FROM poolmon/tickbase:latest
MAINTAINER David Antliff <david.antliff@gmail.com>

RUN apt-get update && apt-get install -y chronograf

EXPOSE 8888
VOLUME /var/lib/chronograf

# Instead of using -b here, we could define BOLT_PATH=/var/lib/chronograf/chronograf-v1.db at 'docker run':
CMD ["/usr/bin/chronograf", "-b", "/var/lib/chronograf/chronograf-v1.db"]

# Perhaps in the future we might need this:
#VOLUME ["/usr/share/chronograf", "/var/lib/chronograf"]
#CMD ["/usr/bin/chronograf", "-b", "/var/lib/chronograf/chronograf-v1.db", "-c", "/usr/share/chronograf/canned"]

