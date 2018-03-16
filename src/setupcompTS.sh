#!/bin/bash

rm index.html app.ts app.css bundle.js

if [ $1 == "bar" ]; then
	echo Setting up for $1 charts
	ln -s ~/web/scratch/bar.ts app.ts
	ln -s ~/web/scratch/bar.css app.css
	ln -s ~/web/scratch/indexbarTS.html index.html
elif [ $1 == "pie" ]; then
	echo Setting up for $1 charts
	ln -s ~/web/scratch/twoPieCharts.ts app.ts
	ln -s ~/web/scratch/style.css app.css
	ln -s ~/web/scratch/index2pTS.html index.html
elif [ $1 == "squares" ]; then
	echo Setting up for $1 charts
	ln -s ~/web/scratch/squares.ts app.ts
	ln -s ~/web/scratch/squares.css app.css
	ln -s ~/web/scratch/indexsqTS.html index.html
elif [ $1 == "gauge" ]; then
	echo Setting up for $1 charts
	ln -s ~/web/scratch/gauge.ts app.ts
	ln -s ~/web/scratch/gauge.css app.css
	ln -s ~/web/scratch/indexgTS.html index.html
elif [ $1 == "panel" ]; then
	echo Setting up for $1 charts
	ln -s ~/web/scratch/panel.ts app.ts
	ln -s ~/web/scratch/panel.css app.css
	ln -s ~/web/scratch/indexpTS.html index.html
else
	echo No parameter, not setting up anything!
fi

ls -alFH --time-style=+%d-%m-%Y\ %T 
