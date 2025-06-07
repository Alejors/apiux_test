import { Inject, Injectable } from "@nestjs/common";
import { Upload } from "./upload.interface";
import { UPLOAD_PROVIDER } from "../../constants";

@Injectable()
export class UploadService {
  constructor(@Inject(UPLOAD_PROVIDER) private readonly provider: Upload) {}

  upload(file: Buffer): Promise<string> {
    return this.provider.upload(file);
  }
}
