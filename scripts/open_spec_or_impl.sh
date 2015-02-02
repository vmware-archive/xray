#!/bin/bash

if [ -z "$1" ]; then
    echo "This script must be called with an argument" >&2
    exit 1
fi


echo $1
if [[ "$1" =~ .*spec\.js ]]; then
    #in a spec file
    file_to_open_part1=${1/spec\//\/}
    file_to_open=${file_to_open_part1/_spec\.js/\.js}
else
    file_to_open_part1=${1/app\//spec\/app\/}
    file_to_open=${file_to_open_part1/\.js/_spec\.js}
fi

touch $file_to_open

wstorm $file_to_open

