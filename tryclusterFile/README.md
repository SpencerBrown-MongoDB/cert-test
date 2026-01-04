This is like "likeAtlaswithmTLS" except that we now hove a clusterFile client certificate signed by CA1. So we have:

* certificateKeyFile server cert signed by CA1
* clusterFile client cert signed by CA1
* CAFile is CA1
* clusterCAFile is CA2
  
This gets a validation error because

* node A connects to node B and sends Client Hello
* node B responds with its server certificate (certificateKeyFile) signed by CA1
* node A validates the server certificate with its CAFile signed by CA1
* node A sends its client certificate signed by CA1 
* node B tries to validate this with its clusterCAFile, but that fails because it is signed by CA2