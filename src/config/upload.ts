import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const localPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  localPath,
  storage: multer.diskStorage({
    destination: localPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
