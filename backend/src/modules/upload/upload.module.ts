import { Module } from "@nestjs/common";

import { UploadService } from "./upload.service";
import { UPLOAD_PROVIDER } from "../../constants";
import { GcsService } from "../../frameworks/cloud-storage/gcs.service";

@Module({
  providers: [
    UploadService,
    {
      provide: UPLOAD_PROVIDER,
      useClass: GcsService,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
