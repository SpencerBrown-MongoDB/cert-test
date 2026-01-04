This is just like "likeAtlaswithNoClientAuth" but with mTLS enabled for internal TLS by not setting tlsWithholdClientCertificate. "likeAtlaswithNoClientAuth" is just like "likeAtlas" except the TLS server certificate does not have client auth. 

This fails to connect internally using TLS because it tries to use the certificateKeyFile as a client certificate, which it is not authorized to do. 