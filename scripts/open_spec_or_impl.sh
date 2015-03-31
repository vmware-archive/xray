#!/bin/bash

if [ -z "$1" ]; then
    echo "This script must be called with an argument" >&2
    exit 1
fi


echo $1
if [[ "$1" =~ .*spec\.js ]]; then
    #in a spec file
    if [ -d "app" ]; then
        # source files are in app/, spec files are in spec/app/
        file_to_open_part1=${1/spec\//\/}
    else
       # source files are in src/, spec files are in spec/
       file_to_open_part1=${1/spec\//src\//}
    fi
    file_to_open=${file_to_open_part1/_spec\.js/\.js}
else
    if [ -d "app" ]; then
        # source files are in app/, spec files are in spec/app/
        file_to_open_part1=${1/app\//spec\/app\/}
    else
       # source files are in src/, spec files are in spec/
        file_to_open_part1=${1/src\//spec\//}
    fi
    file_to_open=${file_to_open_part1/\.js/_spec\.js}
fi

touch $file_to_open

wstorm $file_to_open

