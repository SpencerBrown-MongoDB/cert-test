This is like "likeAtlaswithmTLS" except that we now hove a clusterFile client certificate signed by CA1. So we have:

* certificateKeyFile server cert signed by CA1
* clusterFile client cert signed by CA1
* CAFile is CA2
* clusterCAFile is CA1
  
This gets a validation error because:

* node A connects to node B and sends Client Hello
* node B responds with its server certificate from certificateKeyFile signed by CA1
* node A uses its CAFile to validate but it can only validate for CA2

