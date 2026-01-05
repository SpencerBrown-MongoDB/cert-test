you need to run this on a recent Linux. I used Ubuntu 24.04 in my tests, in an Apple VM on my MacBook. 

Add this line to /etc/hosts: (use an IP address that is equivalent to localhost)

```
127.0.1.2 mongodb-local.computer
```

Now download the tarball for MongoDB Server for the appropriate platform and release. Untar it and put mongod into the path. 
Now do the same for mongosh.
and finally, you need mongotls on the path; get it from https://github.com/SpencerBrown-MongoDB/mongodb-tls-certs/releases/latest

From this repo:

* cd to the testcase you want to run
* `../run.sh` to create the TLS artifacts and start the mongod instances
* `../init.sh` to initialize the replica set and add a SCRAM and an X509 user
* The logs are at `data/m1.log`, `data/m2.log`, `data/m3.log`
* `../connect.sh` to connect to the replica set and authenticate as a SCRAM user called admin with full root privileges
* `../x509-connect.sh` to connect to the replica set and authenticate as an X509 user called admin with full root privileges
* `../stop.sh` to shut down the replica set, delete the data directories, and delete the TLS artifacts
  
To add a new test:

* copy an old test directory to a new test directory
* the mongod config is in config.yaml, edit as appropriate
* the TLS generation config is in mongotls.yaml