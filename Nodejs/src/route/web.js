// khai bao tat ca duong link tren server
import express from "express";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController"
import clinicController from "../controllers/clinicController"
import handbookController from "../controllers/handbookController";
let router = express.Router();


let initWebRoutes = (app) => {
    /**
     * @swagger
     * /api/login:
     *   post:
     *     summary: User login
     *     tags:
     *       - User
     *     requestBody:
     *       description: User credentials for login.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: doctor1@gmail.com
     *               password:
     *                 type: string
     *                 example: 123456
     *     responses:
     *       '200':
     *         description: Successful response. Returns the login result.
     *       '500':
     *         description: Internal server error.
     */
    router.post('/api/login', userController.handleLogin);
    /**
     * @swagger
     * /api/register:
     *   post:
     *     summary: User registration
     *     tags:
     *       - User
     *     requestBody:
     *       description: User registration details.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               data:
     *                 type: object
     *                 properties:
     *                   username:
     *                     type: string
     *                     example: john.doe@example.com
     *                   password:
     *                     type: string
     *                     example: 123
     *                   fullName:
     *                     type: string
     *                     example: John Doe
     *                   phoneNumber:
     *                     type: string
     *                     example: +123456789
     *     responses:
     *       '200':
     *         description: Successful response. Returns the login result.
     *       '500':
     *         description: Internal server error.
     */
    router.post('/api/register', userController.handleRegister);
    /**
     * @swagger
     * /api/get-all-users:
     *   get:
     *     summary: Get all users
     *     tags:
     *       - User
     *     parameters:
     *       - in: query
     *         name: id
     *         description: User ID. Use 'ALL' to retrieve all users.
     *         required: true
     *         schema:
     *           type: string
     *           example: ALL
     *     responses:
     *       '200':
     *         description: Successful response. Returns the list of users.
     *       '400':
     *         description: Bad request. Required parameters are missing.
     */
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    /**
     * @swagger
     * /api/create-new-user:
     *   post:
     *     summary: Tạo người dùng mới
     *     tags:
     *       - User
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: example01
     *               password:
     *                 type: string
     *                 example: 123456
     *               firstName:
     *                 type: string
     *                 example: examplefirst
     *               lastName:
     *                 type: string
     *                 example: examplelast
     *               address:
     *                 type: string
     *                 example: example street
     *               phoneNumber:
     *                 type: string
     *                 example: 123456789
     *               gender:
     *                 type: string
     *                 example: F
     *               roleId:
     *                 type: integer
     *                 example: R3
     *               positionId:
     *                 type: integer
     *                 example: P1
     *               avatar:
     *                 type: string
     *             required:
     *               - email
     *               - password
     *               - firstName
     *               - lastName
     *               - roleId
     *               - positionId
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     */
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    /**
     * @swagger
     * /api/edit-user:
     *   put:
     *     summary: Chỉnh sửa thông tin người dùng
     *     tags:
     *       - User
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 37
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               address:
     *                 type: string
     *               roleId:
     *                 type: integer
     *                 example: R3
     *               positionId:
     *                 type: integer
     *                 example: R2
     *               gender:
     *                 type: string
     *                 example: F
     *               phoneNumber:
     *                 type: string
     *               avatar:
     *                 type: string
     *             required:
     *               - id
     *               - roleId
     *               - positionId
     *               - gender
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     */
    router.put('/api/edit-user', userController.handleEditUser);
    /**
     * @swagger
     * /api/delete-user:
     *   delete:
     *     summary: Xóa người dùng
     *     tags:
     *       - User
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 37
     *             required:
     *               - id
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     */
    router.delete('/api/delete-user', userController.handleDeleteUser);
    /**
     * @swagger
     * /api/allcode:
     *   get:
     *     summary: Lấy danh sách mã allcode theo loại
     *     tags:
     *       - User
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           example: ROLE
     *         required: true
     *         description: Loại mã allcode cần lấy
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/allcode', userController.getAllCode);


    /**
     * @swagger
     * /api/top-doctor-home:
     *   get:
     *     summary: Lấy danh sách bác sĩ hàng đầu
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Số lượng bác sĩ cần lấy (mặc định là 10)
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    /** 
     * @swagger
     * /api/get-all-doctors:
     *  get:
     *    tags:
     *      - Doctor
     *    summary: Get all doctors
     *    description: Returns all doctors
     *    responses:
     *      '200':
     *        description: doctor response
     *      '400':
     *        description: error
     */
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    /** 
     * @swagger
     * /api/save-infor-doctors:
     *  post:
     *    tags:
     *      - Doctor
     *    summary: Save detailed information of a doctor
     *    description: Save detailed information of a doctor
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              action:
     *                type: string
     *                example: EDIT
     *              doctorId:
     *                type: integer
     *                example: 32
     *              specialtyId:
     *                type: integer
     *                example: 1 
     *              contentHTML:
     *                type: string
     *              contentMarkdown:
     *                type: string
     *              selectedPrice:
     *                type: string
     *              selectedProvince:
     *                type: string
     *              selectedPayment:
     *                type: string
     *              nameClinic:
     *                type: string
     *                example: Số 73 ngõ 109 Hoàng Ngân - Thanh Xuân - Hà 
     *              addressClinic:
     *                type: string
     *              note:
     *                type: string
     *                example: Giá khám chưa bao gồm chi phí chụp chiếu, xét nghiệm
     *    responses:
     *      '200':
     *        description: doctor response
     *      '400':
     *        description: error
     */
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);
    /**
     * @swagger
     * /api/get-detail-doctor-by-id:
     *   get:
     *     summary: Lấy thông tin chi tiết bác sĩ theo ID
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: id
     *         schema:
     *           type: integer
     *           example: 33
     *         description: ID của bác sĩ
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    /**
     * @swagger
     * /api/bulk-create-schedule:
     *   post:
     *     summary: Tạo lịch hẹn hàng loạt cho bác sĩ
     *     tags:
     *       - Doctor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               arrSchedule:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     doctorId:
     *                       type: integer
     *                       example: 34
     *                     date:
     *                       type: string
     *                       example: 1716224400000
     *                     timeType:
     *                       type: string
     *                       example: T3
     *               doctorId:
     *                 type: string
     *                 example: 34
     *               formattedDate:
     *                 type: string
     *                 example: 1716224400000
     *             required:
     *               - arrSchedule
     *               - doctorId
     *               - formattedDate
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    /**
     * @swagger
     * /api/get-schedule-doctor-by-date:
     *   get:
     *     summary: Lấy lịch hẹn của bác sĩ theo ngày
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: doctorId
     *         schema:
     *           type: string
     *           example: 34
     *         required: true
     *         description: ID của bác sĩ
     *       - in: query
     *         name: date
     *         schema:
     *           type: string
     *           example: 1716224400000
     *         required: true
     *         description: Ngày lấy lịch hẹn (định dạng YYYY-MM-DD)
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    /**
     * @swagger
     * /api/get-extra-infor-doctor-by-id:
     *   get:
     *     summary: Lấy thông tin bổ sung của bác sĩ bằng ID
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: doctorId
     *         schema:
     *           type: string
     *           example: 34
     *         required: true
     *         description: ID của bác sĩ
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorbyId);
    /**
     * @swagger
     * /api/get-profile-doctor-by-id:
     *   get:
     *     summary: Lấy thông tin hồ sơ của bác sĩ bằng ID
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: doctorId
     *         schema:
     *           type: string
     *           example: 34
     *         required: true
     *         description: ID của bác sĩ
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorbyId);


    /**
     * @swagger
     * /api/get-list-patient-for-doctor:
     *   get:
     *     summary: Lấy danh sách bệnh nhân cho bác sĩ
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: doctorId
     *         schema:
     *           type: string
     *           example: 34
     *         required: true
     *         description: ID của bác sĩ
     *       - in: query
     *         name: date
     *         schema:
     *           type: string
     *           example: 1714842000000
     *         required: true
     *         description: Ngày
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    /**
     * @swagger
     * /api/send-remedy:
     *   post:
     *     summary: Gửi đơn thuốc từ bác sĩ cho bệnh nhân
     *     tags:
     *       - Doctor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: httd343@gmail.com
     *               doctorId:
     *                 type: string
     *                 example: 34
     *               patientId:
     *                 type: string
     *                 example: 35
     *               timeType:
     *                 type: string
     *                 example: T4
     *               imgBase64:
     *                 type: string
     *                 example: 
     *               language:
     *                 type: string
     *                 example: vi
     *               patientName:
     *                 type: string
     *                 example: Quỳnh Anh
     *             required:
     *               - email
     *               - doctorId
     *               - patientId
     *               - timeType
     *               - imgBase64
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/send-remedy', doctorController.sendRemedy);
    /**
     * @swagger
     * /api/save-history:
     *   post:
     *     summary: Lưu thông tin lịch sử khám bệnh
     *     tags:
     *       - Doctor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               patientId:
     *                 type: string
     *                 example: 35
     *               doctorId:
     *                 type: string
     *                 example: 34
     *               recordId:
     *                 type: string
     *                 example: 11
     *               date:
     *                 type: string
     *                 example: 1714842000000
     *               files:
     *                 type: string
     *                 example: 
     *               fullName:
     *                 type: string
     *                 example:
     *               address:
     *                 type: string
     *                 example:
     *               phoneNumber:
     *                 type: string
     *                 example:
     *               gender:
     *                 type: string
     *                 example:
     *               bookingId:
     *                 type: string
     *                 example:
     *             required:
     *               - patientId
     *               - doctorId
     *               - recordId
     *               - date
     *               - files
     *               - fullName
     *               - address
     *               - phoneNumber
     *               - gender
     *               - bookingId
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/save-history', doctorController.saveHistory);
    /**
     * @swagger
     * /api/get-list-history:
     *   get:
     *     summary: Lấy danh sách lịch sử khám bệnh của bệnh nhân
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: patientId
     *         schema:
     *           type: string
     *           example: 35    
     *         description: ID của bệnh nhân
     *         required: true
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-list-history', doctorController.getListHistory);
    /**
     * @swagger
     * /api/get-list-patient:
     *   get:
     *     summary: Lấy danh sách bệnh nhân theo ngày
     *     tags:
     *       - Doctor
     *     parameters:
     *       - in: query
     *         name: date
     *         schema:
     *           type: string
     *           example: 1714842000000
     *         description: Ngày khám bệnh
     *         required: true
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-list-patient', doctorController.getListPatient);
    /**
     * @swagger
     * /api/get-booking-patient:
     *   delete:
     *     summary: Xóa thông tin đặt lịch khám bệnh của bệnh nhân
     *     tags:
     *       - Doctor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 90
     *             required:
     *               - id
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.delete('/api/get-booking-patient', doctorController.deleteBookingPatient);
    /**
     * @swagger
     * /api/post-booking-recurrence:
     *   post:
     *     summary: Đặt lịch tái khám
     *     tags:
     *       - Doctor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               recordId:
     *                 type: integer
     *                 example: 11
     *               doctorId:
     *                 type: integer
     *                 example: 34
     *               patientId:
     *                 type: integer
     *                 example: 35
     *               date:
     *                 type: string
     *                 format: date
     *                 example: 1714842000000
     *               timeType:
     *                 type: string
     *                 example: T2
     *               oldAppointmentId:
     *                 type: integer
     *                 example: 90
     *             required:
     *               - recordId
     *               - doctorId
     *               - patientId
     *               - date
     *               - timeType
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/post-booking-recurrence', doctorController.postBookingRecurrence);
    /**
     * @swagger
     * /api/post-detail-recurrence:
     *   post:
     *     summary: Lấy chi tiết các lần tái khám
     *     tags:
     *       - Doctor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 90
     *               oldAppointmentId:
     *                 type: integer
     *                 example: 0
     *             required:
     *               - id
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/post-detail-recurrence', doctorController.postDetailRecurrence);


    /**
     * @swagger
     * /api/patient-book-appointment:
     *   post:
     *     summary: Đặt cuộc hẹn cho bệnh nhân
     *     tags:
     *       - Patient
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               recordId:
     *                 type: integer
     *                 example: 8
     *               doctorId:
     *                 type: integer
     *                 example: 34
     *               date:
     *                 type: string
     *                 format: date
     *                 example: 1714842000000
     *               timeType:
     *                 type: string
     *                 example: T2
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    /**
     * @swagger
     * /api/verify-book-appointment:
     *   post:
     *     summary: Xác nhận và cập nhật cuộc hẹn đã đặt
     *     tags:
     *       - Patient
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *                 example: ae7362ea-f899-4b77-8665-3d73f33aa8ce
     *               doctorId:
     *                 type: integer
     *                 example: 34
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    /**
     * @swagger
     * /api/patient-create-record:
     *   post:
     *     summary: Tạo hồ sơ mới cho bệnh nhân
     *     tags:
     *       - Patient
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: integer
     *                 example: 35
     *               fullName:
     *                 type: string
     *                 example: Lệ Quyên
     *               address:
     *                 type: string
     *                 example: HCM
     *               phoneNumber:
     *                 type: string
     *                 example: 1234567890
     *               gender:
     *                 type: string
     *                 example: M
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/patient-create-record', patientController.addNewRecord);
    /**
     * @swagger
     * /api/get-all-records:
     *   get:
     *     summary: Lấy danh sách tất cả hồ sơ của bệnh nhân
     *     tags:
     *       - Patient
     *     parameters:
     *       - in: query
     *         name: patientId
     *         schema:
     *           type: integer
     *           example: 35
     *         required: true
     *         description: ID của bệnh nhân
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-all-records', patientController.getAllRecords);
    /**
     * @swagger
     * /api/delete-record:
     *   delete:
     *     summary: Xóa hồ sơ bệnh nhân
     *     tags:
     *       - Patient
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 14
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.delete('/api/delete-record', patientController.deleteRecord);
    /**
     * @swagger
     * /api/post-patient-number:
     *   post:
     *     summary: Lấy số lượng hiện tại tại thời điểm đó
     *     tags:
     *       - Patient
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               doctorId:
     *                 type: integer
     *                 example: 34
     *               timeType:
     *                 type: string
     *                 example: T1
     *               date:
     *                 type: string
     *                 example: 1714842000000
     *     responses:
     *       '200':
     *         description: Successfully retrieved patient number.
     */
    router.post('/api/post-patient-number', patientController.getPatientNumber);


    /**
     * @swagger
     * /api/create-new-specialty:
     *   post:
     *     summary: Tạo mới chuyên khoa
     *     tags:
     *       - Specialty
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               imageBase64:
     *                 type: string
     *               descriptionHTML:
     *                 type: string
     *               descriptionMarkdown:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    /**
     * @swagger
     * /api/get-specialty:
     *   get:
     *     summary: Lấy danh sách chuyên khoa
     *     tags:
     *       - Specialty
     *     responses:
     *       '200':
     *         description: Thành công
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    /**
     * @swagger
     * /api/get-detail-specialty-by-id:
     *   get:
     *     summary: Lấy thông tin chi tiết chuyên khoa bằng ID
     *     tags:
     *       - Specialty
     *     parameters:
     *       - in: query
     *         name: inputId
     *         required: true
     *         schema:
     *           type: string
     *           example: 1
     *         description: ID của chuyên khoa
     *       - in: query
     *         name: location
     *         required: true
     *         schema:
     *           type: string
     *           example: ALL
     *         description: Vị trí (tỉnh/thành phố)
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);


    /**
     * @swagger
     * /api/create-new-clinic:
     *   post:
     *     summary: Tạo phòng khám mới
     *     tags:
     *       - Clinic
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               imageBase64:
     *                 type: string
     *               descriptionHTML:
     *                 type: string
     *               descriptionMarkdown:
     *                 type: string
     *               address:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/create-new-clinic', clinicController.createClinic);
    /**
     * @swagger
     * /api/get-clinic:
     *   get:
     *     summary: Lấy danh sách phòng khám
     *     tags:
     *       - Clinic
     *     responses:
     *       '200':
     *         description: Thành công
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-clinic', clinicController.getAllClinic);
    /**
     * @swagger
     * /api/get-detail-clinic-by-id:
     *   get:
     *     summary: Lấy thông tin chi tiết phòng khám theo ID
     *     tags:
     *       - Clinic
     *     parameters:
     *       - in: query
     *         name: id
     *         schema:
     *           type: integer
     *           example: 2
     *         required: true
     *         description: ID của phòng khám
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    /**
     * @swagger
     * /api/edit-clinic:
     *   put:
     *     summary: Cập nhật thông tin phòng khám
     *     tags:
     *       - Clinic
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *               name:
     *                 type: string
     *               address:
     *                 type: string
     *               descriptionHTML:
     *                 type: string
     *               descriptionMarkdown:
     *                 type: string
     *               image:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.put('/api/edit-clinic', clinicController.updateClinicData);
    /**
     * @swagger
     * /api/delete-clinic:
     *   delete:
     *     summary: Xóa thông tin phòng khám
     *     tags:
     *       - Clinic
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.delete('/api/delete-clinic', clinicController.deleteClinicData);


    /**
     * @swagger
     * /api/create-new-handbook:
     *   post:
     *     summary: Tạo hướng dẫn mới
     *     tags:
     *       - Handbook
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               imageBase64:
     *                 type: string
     *               descriptionHTML:
     *                 type: string
     *               descriptionMarkdown:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.post('/api/create-new-handbook', handbookController.createHandbook);
    /**
     * @swagger
     * /api/get-handbook:
     *   get:
     *     summary: Lấy danh sách hướng dẫn
     *     tags:
     *       - Handbook
     *     responses:
     *       '200':
     *         description: Thành công
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-handbook', handbookController.getAllHandbook);
    /**
     * @swagger
     * /api/get-detail-handbook-by-id:
     *   get:
     *     summary: Lấy thông tin chi tiết hướng dẫn bằng ID
     *     tags:
     *       - Handbook
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 2
     *         description: ID của hướng dẫn
     *     responses:
     *       '200':
     *         description: Thành công
     *       '400':
     *         description: Lỗi yêu cầu không hợp lệ
     *       '500':
     *         description: Lỗi từ máy chủ
     */
    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);

    return app.use("/", router);
}

module.exports = initWebRoutes;