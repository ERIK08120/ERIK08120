#!/bin/bash
cd "$(dirname "$0")"
PORT=8000
echo "CleanGate laeuft auf http://localhost:$PORT/"
echo "Dieses Fenster offen lassen. Zum Beenden schliessen."
(sleep 1; open "http://localhost:$PORT/") &
python3 -m http.server $PORT --bind 127.0.0.1
