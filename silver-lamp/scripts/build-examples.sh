#!/bin/bash

FAILED=false

for filename in examples/*.sl; do
    echo Building $filename...
    node dist/assembler/index.js --input "$filename" --hex
    if [ $? -eq 0 ]; then
        echo OK
    else
        echo FAIL
        FAILED=true
    fi
done

if [ "$FAILED" = true ]; then
    exit 1
fi