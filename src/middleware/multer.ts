import { Request } from 'express';
import multer, { StorageEngine } from 'multer';

export const attachmentValidation = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/svg'],
  file: ['application/pdf'],
};

function fileUpload(customValidation: string[] = []) {
  const storage: StorageEngine = multer.diskStorage({});
  function fileFilter(req: Request, file: Express.Multer.File, cb: any) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid extension'), false);
    }
  }

  const upload = multer({ fileFilter, storage });
  return upload;
}

export default fileUpload;
