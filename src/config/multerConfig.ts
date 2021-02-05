import { Request } from "express"
import multer from "multer"
import * as crypto from "crypto"
import multerMinioStorage from "multer-minio-storage"
import * as Minio from "minio"

const minioClient = new Minio.Client({
  endPoint: 'play.minio.io',
  port: 9000,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
})

const storage = multerMinioStorage({
  minioClient: minioClient,
  bucket: 'album-files-bucket',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    crypto.randomBytes(16, (error, hash) => {
      if (error) {
        cb(error, file.filename)
      }
      const filename = `${hash.toString('hex')}-${file.originalname}`

      cb(null, filename)
    })
  }
})

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowedMimes = [
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/gif",
  ]

  console.log(file.mimetype)

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type"))
  }
}

const multerConfig = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1204 },
  fileFilter
})

export default multerConfig