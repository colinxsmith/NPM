#!/bin/bash

rm index.html app.ts app.css bundle.js

if [ $1 == "bar" ]; then
	echo Setting up for $1 charts
	ln -s ../../scratch/bar.ts app.ts
	ln -s ../../scratch/bar.css app.css
	ln -s ../../scratch/indexbarTS.html index.html
elif [ $1 == "pie" ]; then
	echo Setting up for $1 charts
	ln -s ../../scratch/twoPieCharts.ts app.ts
	ln -s ../../scratch/style.css app.css
	ln -s ../../scratch/index2pTS.html index.html
elif [ $1 == "squares" ]; then
	echo Setting up for $1 charts
	ln -s ../../scratch/squares.ts app.ts
	ln -s ../../scratch/squares.css app.css
	ln -s ../../scratch/indexsqTS.html index.html
elif [ $1 == "gauge" ]; then
	echo Setting up for $1 charts
	ln -s ../../scratch/gauge.ts app.ts
	ln -s ../../scratch/gauge.css app.css
	ln -s ../../scratch/indexgTS.html index.html
elif [ $1 == "panel" ]; then
	echo Setting up for $1 charts
	ln -s ../../scratch/panel.ts app.ts
	ln -s ../../scratch/panel.css app.css
	ln -s ../../scratch/indexpTS.html index.html
else
	echo No parameter, not setting up anything!
fi

ls -alFH --time-style=+%d-%m-%Y\ %T 
