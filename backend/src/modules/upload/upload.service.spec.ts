import { Test, TestingModule } from "@nestjs/testing";

import { Upload } from "./upload.interface";
import { UPLOAD_PROVIDER } from "../../constants/index";
import { UploadService } from "./upload.service";
import { createTestModule } from "../../../tests/utils/test-utils";

describe("UploadService", () => {
  let service: UploadService;

  const mockUploadProvider: Upload = {
    upload: jest.fn().mockResolvedValue("https://fake.url/forTesting.jpg"),
  };

  beforeEach(async () => {
    const { app } = await createTestModule(
      [],
      [],
      [
        UploadService,
        { provide: UPLOAD_PROVIDER, useValue: mockUploadProvider },
      ],
    );

    service = app.get<UploadService>(UploadService);
  });

  it("debería retornar la URL de la imagen subida", async () => {
    const mockBuffer = Buffer.from("Random Info for Testing");
    const url = await service.upload(mockBuffer);

    expect(url).toBe("https://fake.url/forTesting.jpg");
    expect(mockUploadProvider.upload).toHaveBeenCalledWith(mockBuffer);
  });
});
