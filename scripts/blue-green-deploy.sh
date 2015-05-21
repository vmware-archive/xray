#!/bin/bash

cf api $API
cf app $NAME || cf login -o $ORG -s $SPACE

COLDNAME=$NAME-cold

cf push $COLDNAME -f $MANIFEST

DOMAINS=("${DOMAINS[@]}")

OIFS=$IFS
IFS=','
for DOMAIN in ${DOMAINS[@]}; do
  eval "cf map-route $COLDNAME $DOMAIN"
  eval "cf unmap-route $NAME $DOMAIN"
done

cf push $NAME -f $MANIFEST

for DOMAIN in ${DOMAINS[@]}; do
  eval "cf map-route $NAME $DOMAIN"
  eval "cf unmap-route $COLDNAME $DOMAIN"
done
IFS=$OIFS

cf stop $COLDNAME