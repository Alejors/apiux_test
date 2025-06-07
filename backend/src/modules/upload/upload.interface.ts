export interface Upload {
  upload(imageBuffer: Buffer): Promise<string>;
}
