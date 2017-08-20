# Pool Temperature Monitoring Project



## Dependencies

Docker Compose:

    $ pip install docker-compose

https://github.com/pascaldevink/rpi-mosquitto.git


## Building

To build all the docker containers:

    $ cd services
	$ docker-compose build

## Running

To start the stack (`--force-recreate` used to ensure fresh containers):

    $ cd services
	$ docker-compose -p poolmon up --force-recreate

Hit CTRL-C to terminate the stack. You can then bring it back up with the `up` command immediately, or shut it down entirely (to create new containers on next up) with:

    $ docker-compose -p poolmon down


## Interfaces

Access the Chronograf interface via HTTP on port 8888.


