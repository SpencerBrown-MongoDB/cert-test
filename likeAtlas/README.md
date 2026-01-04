This is exactly like Atlas. 

For internal connections: 

* the TLS server certificate in certificateKeyFile is validated by the CA certificate in CAFile. 
* No client certificate is used because we set the server parameter tlsWithholdClientCertificate.

For external connections: 

* the TLS server certificate is validated by the client using their trust store. This would normally be a public CA and the client would by default trust it. 
* The client certificate is validated by the server's clusterCAFile, which is a different CA than the CAFile which was used to sign the certificateKeyFile.