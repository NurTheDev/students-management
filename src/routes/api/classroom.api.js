const express = require('express');
const router = express.Router();
const classroomController = require('../../controllers/classroom.controller');
const {authGard, authorize} = require('../../middlewares/Authorization');
const {validate} = require('../../middlewares/validate');
const {createClassroomSchema, updateClassroomSchema} = require('../../validators/classroom.validation');
const upload = require('../../middlewares/multer');

router.use(authGard);

router.get('/classroom/:id', classroomController.getClassroomById);
router.get('/all-classrooms', classroomController.getAllClassrooms);

router.post(
    '/create',
    authorize('TEACHER', 'STAFF', 'USER'),
    validate(createClassroomSchema),
    classroomController.createClassroom
);
router.patch(
    '/update/:id',
    authorize('TEACHER', 'STAFF', 'USER'),
    upload.fields([{name: 'image', maxCount: 1}]),
    validate(updateClassroomSchema),
    classroomController.updateClassroom
);
router.delete('/delete/:id', authorize(), classroomController.deleteClassroom);
router.post('/restore/:id', authorize(), classroomController.restoreClassroom);
router.get('/get-deleted-classrooms', authorize(), classroomController.getDeletedClassrooms);

module.exports = router;