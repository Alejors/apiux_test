import { Injectable } from "@nestjs/common";
import { GCS_STORAGE } from "./gcs.provider";
import { Buffer } from "buffer";
import { Upload } from "../../modules/upload/upload.interface";

@Injectable()
export class GcsService implements Upload {
  async checkBucket(bucketName: string) {
    const bucket = GCS_STORAGE.bucket(bucketName);
    const [exists] = await bucket.exists();
    if (!exists) {
      await bucket.create();
    }
    return bucket;
  }
  async upload(buffer: Buffer, bucketName: string = "default") {
    const filename = `book-${Date.now()}.jpg`;
    const bucket = await this.checkBucket(bucketName);
    const file = bucket.file(filename);
    await file.save(buffer);
    return `http://localhost:4443/storage/v1/b/${bucketName}/o/${filename}?alt=media`;
  }
}
