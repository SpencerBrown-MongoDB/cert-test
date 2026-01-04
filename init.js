print("\nInitializing replica set");
config = {
    _id: "testx509",
    members: [
        {_id: 0, host: "mongodb-local.computer:27017"},
        {_id: 1, host: "mongodb-local.computer:27018"},
        {_id: 2, host: "mongodb-local.computer:27019"},
    ]
};
rs.initiate(config);

print("\nWaiting for replica set to become healthy...");

while (true) {
    sleep(1000);
    ismast = db.isMaster();
    if (ismast.ismaster) {break;}
}

print("\nReplica set healthy, primary is " + ismast.primary);

print("\nSetting up admin user and authenticating");

au = {
    user: 'admin',
    pwd: 'tester',
    roles: ['root'],
};

adb = db.getSiblingDB('admin');
adb.createUser(au);
adb.auth('admin', 'tester');

print("\nSetting up X509 user");

xu = {
    user: "CN=TestX509,OU=Client,O=MongoDB",
    roles: [ 
        {role: "root", db: "admin"}
     ],
}

xdb = db.getSiblingDB('$external');
xdb.createUser(xu);
print("\nInitialization complete\n");
printjson(rs.status());
