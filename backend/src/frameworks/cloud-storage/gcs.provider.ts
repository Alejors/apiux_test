import { Storage } from '@google-cloud/storage';

export const GCS_STORAGE = new Storage({
  apiEndpoint: `http://${process.env.STORAGE_HOST}:${process.env.STORAGE_PORT}`,
  projectId: process.env.GCS_PROJECT_ID || 'fake-gcs-project',
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL || 'test@test.com',
    private_key: process.env.GCS_PRIVATE_KEY || 'fake',
  },
});
