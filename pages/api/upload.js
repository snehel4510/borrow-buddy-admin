import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import {mongooseConnect} from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
// import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
// import mime from 'mime-types';



export const config = {
  api: {bodyParser: false},
};

// export default async function handle(req,res) {
//   await mongooseConnect();
// //   await isAdminRequest(req,res);

//   const form = new multiparty.Form();
//   const {fields,files} = await new Promise((resolve,reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({fields,files});
//     });
//   });
//   console.log('length:', files.file.length);
//   const client = new S3Client({
//     region: 'us-east-1',
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY,
//       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     },
//   });
//   const links = [];
//   for (const file of files.file) {
//     const ext = file.originalFilename.split('.').pop();
//     const newFilename = Date.now() + '.' + ext;
//     await client.send(new PutObjectCommand({
//       Bucket: bucketName,
//       Key: newFilename,
//       Body: fs.readFileSync(file.path),
//       ACL: 'public-read',
//       ContentType: mime.lookup(file.path),
//     }));
//     const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
//     links.push(link);
//   }
//   return res.json({links});
// }






export default async function handler(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req,res);

  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) {
      res.status(500).json({ error: 'Error parsing form data.' });
    } else {
      try {
        const uploadedFiles = [];

        for (const [key, fileData] of Object.entries(files)) {
          const file = fileData[0];
          const uploadDir = path.join(process.cwd(), 'public/uploads'); // Define the local storage directory

          // Create the directory if it doesn't exist
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, `${Date.now().toString()}_${file.originalFilename}`);

          // Move the uploaded file to the public/uploads directory
          fs.renameSync(file.path, filePath);

          // Store the relative URL of the uploaded file (e.g., "/uploads/filename")
          const relativeURL = `/uploads/${path.basename(filePath)}`;
          uploadedFiles.push(relativeURL);
        }

        res.status(200).json({ links: uploadedFiles });
      } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: 'Error handling file upload.' });
      }
    }
  });
}