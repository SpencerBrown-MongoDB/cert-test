while [ $(pgrep mongod | wc -l) -gt 0 ]; do
    pkill mongod
    echo "Waiting for mongod to stop..."
    sleep 2
done
echo "All mongod processes stopped, removing temp directories and config files."
rm -r data tls config1.yaml config2.yaml config3.yaml