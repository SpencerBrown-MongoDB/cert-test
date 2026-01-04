This is like "likeAtlaswithmTLS" except that we now hove a clusterFile client certificate signed by CA1. So we have:

* certificateKeyFile server cert signed by CA1
* clusterFile client cert signed by CA2
* CAFile is CA1
* clusterCAFile is CA2
  
internal TLS works because:

* node A connects to node B and sends Client Hello
* node B responds with its server certificate from certificateKeyFile signed by CA1
* node A uses its CAFile to validate which works because it is CA1
* node A sends its client certificate from clusterFile (signed by CA2)
* node B validates it with its clusterCAFile which is CA2

external TLS will be like:

* external client connects to server and sends Client Hello
* server responds with its server certificate from certificateKeyFile signed by CA1
* client validates it because it has CA1 in its trust store, probably because CA1 was a public CA
* client sends its client certificate signed by CA2
* server validates it with its clusterCAFile signed by CA2

# implications on X509 authentication

* The cluster can authenticate with cluster auth x509
  * this is managed by matching O/OU/DC in the client certificate's DN signed by CA2 to the O/OU/DC in the server certificate's DN signed by CA1. (!)
* for example, a GTS server cert and also an LE server cert have this DN: `CN=*.hpo5vl.mongodb.net` in [this cluster](https://cloud.mongodb.com/v2/682fb4ab1660942ff0d83a2c#/clusters/detail/golden-data-set).
* so, to implement x509 internal auth in Atlas, we would have to use our own managed CA for CA2, because we cannot allow a customer to create a client certificate that could match the CN of our server certificate and give it full internal auth. 