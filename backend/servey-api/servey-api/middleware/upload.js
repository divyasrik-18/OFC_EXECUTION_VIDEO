// import multer from 'multer';

// const storage = multer.memoryStorage();
// const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// export default upload;


import multer from 'multer';

// Store file in memory to pass buffer to Synology Service
const storage = multer.memoryStorage();

// Limit file size (e.g., 50MB)
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 } 
});

export default upload;