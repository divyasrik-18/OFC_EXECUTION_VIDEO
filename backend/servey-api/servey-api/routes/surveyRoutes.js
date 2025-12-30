import express from 'express';
import multer from 'multer';
import { createSurvey, getSurveys, cancelSurvey, updateSurveyDetails, readFile } from '../controllers/surveyController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.get('/all', getSurveys);
router.get('/read-file', readFile);

router.post('/', upload.fields([
    { name: 'photos', maxCount: 1 },
    { name: 'videos', maxCount: 2 },
    { name: 'selfie', maxCount: 1 },
    { name: 'gopro', maxCount: 1}
]), createSurvey);

router.put('/:id', upload.fields([
    { name: 'photos', maxCount: 1 },
    { name: 'videos', maxCount: 2 },
    { name: 'selfie', maxCount: 1 },
    { name: 'gopro', maxCount: 1}
]), updateSurveyDetails);


router.delete('/:id/cancel', cancelSurvey); 

export default router;