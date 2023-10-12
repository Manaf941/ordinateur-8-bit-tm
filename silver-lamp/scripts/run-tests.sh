#!/bin/bash

FAILED=false

for filename in examples/*.js; do
    echo Running $filename...
    node "$filename"
    if [ $? -eq 0 ]; then
        echo Test passed
    else
        echo Test $filename failed
        FAILED=true
    fi
done

if [ "$FAILED" = true ]; then
    exit 1
fi