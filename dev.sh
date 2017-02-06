#!/bin/bash

sass --watch index.sass:index.css &

cd ..
python -m SimpleHTTPServer 8080 &
cd -
