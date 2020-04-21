https://www.grzegorowski.com/how-to-backup-and-restore-influxdb-which-runs-inside-docker-container

```
$ docker exec -it 7c8fea187c44 influxd backup -database poolmon /influxdb_backup
$ docker cp 7c8fea187c44:/influxdb_backup/ local_backup
```

Then rsync these files off the RPi.

Don't forget to re-enter the container and remove the backup files, to free up space:

```
$ docker exec -it 7c8fea187c44 /bin/bash
```

