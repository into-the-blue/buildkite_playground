# usr/bin/bash
pwd
docker-compose -f ./docker-compose.prod.yml up
ls
docker-compose -f ./docker-compose.prod.yml down