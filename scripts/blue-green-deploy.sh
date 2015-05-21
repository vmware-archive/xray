#!/bin/bash
set -e

cf api $API
cf app $NAME || cf login -o $ORG -s $SPACE
BLUENAME=$NAME-blue

cf push $BLUENAME -f $MANIFEST

ROUTES=("${ROUTES[@]}")

OIFS=$IFS
IFS=','
for ROUTE in ${ROUTES[@]}; do
  eval "cf map-route $BLUENAME $ROUTE"
  eval "cf unmap-route $NAME $ROUTE"
done

cf push $NAME -f $MANIFEST

for ROUTE in ${ROUTES[@]}; do
  eval "cf map-route $NAME $ROUTE"
  eval "cf unmap-route $BLUENAME $ROUTE"
done
IFS=$OIFS

cf stop $BLUENAME