export interface Asset {
  filename: string;
  parentPath: string;
  ext: string;
  name: string;
}

export interface UploadAssetsResult {
  filename: string;
  status: string;
  error?: string;
}
