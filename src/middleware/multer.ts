import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

export const attachmentValidation = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/svg'],
  file: ['application/pdf'],
};

const storage: StorageEngine = multer.diskStorage({});
function fileFilter(req: Request, file: Express.Multer.File, cb: any) {
  const customValidation = attachmentValidation.image.concat(attachmentValidation.file);

  if (customValidation.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid extension'), false);
  }
}

function fileUpload(customValidation: string[] = []) {
  const upload = multer({ fileFilter, storage });
  return upload;
}

export default fileUpload;
