import * as admin from 'firebase-admin'
import * as key from './key.json'

const params = {
  type: key.type,
  projectId: key.project_id,
  privateKeyId: key.private_key_id,
  privateKey: key.private_key,
  clientEmail: key.client_email,
  clientId: key.client_id,
  authUri: key.auth_uri,
  tokenUri: key.token_uri,
  authProviderX509CertUrl: key.auth_provider_x509_cert_url,
  clientC509CertUrl: key.client_x509_cert_url
}

admin.initializeApp({
  credential: admin.credential.cert(params)
})
