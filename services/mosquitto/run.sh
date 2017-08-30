#!/bin/bash -e

: "${MOSQUITTO_PATHS_DATA:=/mqtt/data}"
: "${MOSQUITTO_PATHS_LOGS:=/mqtt/log}"
: "${MOSQUITTO_CONFIG:=/mqtt/config/mosquitto.conf}"

chown -R mosquitto.mosquitto "$MOSQUITTO_PATHS_DATA" "$MOSQUITTO_PATHS_LOGS"

/usr/sbin/mosquitto -c "$MOSQUITTO_CONFIG" "$@"

