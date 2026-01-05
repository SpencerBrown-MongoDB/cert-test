# Overview

This test shows it is feasible to have a MongoDB replica set with certificates from two different CAs, and still have client certificates, internal mTLS, internal X509 authentication, and external X509 users. In particular, this will work with a public CA such as Let's Encrypt or Google Trust Services creating the server certificate, even without client authentication set for that certificate (which is being deprecated), and a private CA for crafting client certificates. 

The testcase showing this in this repo is the `clusterFileandX509auth2" directory.

## Here's how it works:

* A public CA to craft server certificates, call it CA1
* A private CA to craft client certificates, call it CA2

* net.tls.certificateKeyFile: A server certificate signed by CA1, with DN "CN=*.sub.domain" 
  * (as is common with public CAs like Let's Encrypt)
* net.tls.clusterFile: a client certificate signed by CA2, with **the same DN as the server certificate** "CN=*.sub.domain" 
  * which implies the use of a private/self-managed CA, most likely, as public CAs do not generally provide client certificates
* net.tls.CAFile: CA1 trust chain
* net.tls.clusterCAFile: CA2 trust chain
* net.tls.clusterAuthX509.attributes: **the same DN as the server certificate** "CN=*.sub.domain" 
  * note this _must_ match the attributes in the server certificate, or this instance will not start
  * this is proven in "clisterFilenax509auth3"
* net.tls.allowConnectionsWithoutCertificates: typically "true" but could also be "false" (the default) if the customer wanted to require all clients to have client certificates validated by CA2
* security.authorization: enabled
* security.clusterAuthMode: x509
* setParameter.authenticationMechanisms: include MONGODB-X509 and others as desired
* setParameter.tlsWithholdClientCertificate: false (which is the default)
  * this means that mTLS for internal TLS is working!

## here are the flows for internal TLS connection and authentication:

* node A connects to node B with TLS Client Hello
* node B responds with its server certificate from net.tls.certificateKeyFile, which is signed by CA1
* node A validates the server certificate with its net.tls.CAFile, which is the CA1 trust chain
* Node A notices Node B's "Acceptable Client Certificate" list which includes those signed by CA2, since it creates this from its net.tls.clusterCAFile
* node A sends its client certificate from its net.tls.clusterFile, signed by CA2
* node B validates the client certificate using its net.tls.clusterCAFile which is CA2
* the TLS connection is complete, now we need internal authentication. 
* node B checks the DN of the client certificate against the attributes specified in its net.tls.clusterAuthX509.attributes which are also in the DN of the server certificate (namely just the CN). This matches and node A is granted full internal auth in mode B.

## A security caveat:

* Anyone who has access to CA2 and can sign arbitrary client certificates from it also has, in effect, full access to the cluster. 
* This is because a client certificate with a DN that has a CN= attribute matching the CN= of the server certificate is automatically granted full internal access. 
* Therefore, if Atlas implements this scheme, it would only work for Atlas-managed X509 users, and we would have to prohibit any X509 users with a CN starting with "*". 