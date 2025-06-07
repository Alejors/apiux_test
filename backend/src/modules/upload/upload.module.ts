import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { GcsService } from "src/frameworks/cloud-storage/gcs.service";
import { UPLOAD_PROVIDER } from "src/constants";

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
