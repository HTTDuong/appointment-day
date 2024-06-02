import axios from "../axios"

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const handleRegisterApi = (data) => {
    return axios.post('/api/register', { data });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    // return axios.delete('/api/delete-user', {id: userId})
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data)
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookingAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookingAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}

const addNewRecord = (data) => {
    return axios.post('/api/patient-create-record', data)
}

const getAllRecords = (patientId) => {
    return axios.get(`/api/get-all-records?patientId=${patientId}`)
}

const createNewSpectialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}

const getAllSpectialty = () => {
    return axios.get('/api/get-specialty')
}

const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}

const getAllClinic = () => {
    return axios.get('/api/get-clinic')
}

const getAllDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const editClinicService = (inputData) => {
    return axios.put('/api/edit-clinic', inputData);
}

const deleteClinicData = (userId) => {
    return axios.delete('/api/delete-clinic', {
        data: {
            id: userId
        }
    });
}

const getAllPatient = (data) => {
    return axios.get(`/api/get-list-patient?date=${data.date}`)
}

const deleteBookingPatient = (userId) => {
    return axios.delete('/api/get-booking-patient', {
        data: {
            id: userId
        }
    });
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post(`/api/send-remedy`, data)
}

const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}

const getAllHandbook = () => {
    return axios.get('/api/get-handbook')
}

const getAllDetailHandbookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`)
}

const saveHistory = (data) => {
    return axios.post('/api/save-history', data)
}

const getAllHistory = (patientId) => {
    return axios.get(`/api/get-list-history?patientId=${patientId}`)
}

const deleteRecord = (userId) => {
    return axios.delete('/api/delete-record', {
        data: {
            id: userId
        }
    });
}

const postBookingRecurrence = (data) => {
    return axios.post('/api/post-booking-recurrence', data)
}

const postDetailRecurrence = (data) => {
    return axios.post('/api/post-detail-recurrence', data)
}

const postPatientNumber = (data) => {
    return axios.post('/api/post-patient-number', data)
}


export {
    handleLoginApi, getAllUsers,
    createNewUserService, deleteUserService,
    editUserService, getAllCodeService,
    getTopDoctorHomeService, getAllDoctors,
    saveDetailDoctorService, getDetailInforDoctor,
    saveBulkScheduleDoctor, getScheduleDoctorByDate,
    getExtraInforDoctorById, getProfileDoctorById,
    postPatientBookingAppointment, postVerifyBookingAppointment,
    createNewSpectialty, getAllSpectialty, getAllDetailSpecialtyById,
    createNewClinic, getAllClinic, getAllDetailClinicById,
    createNewHandbook, getAllHandbook, getAllDetailHandbookById,
    getAllPatientForDoctor, postSendRemedy, editClinicService, deleteClinicData,
    getAllPatient, deleteBookingPatient, handleRegisterApi, addNewRecord,
    getAllRecords, saveHistory, getAllHistory, deleteRecord, postBookingRecurrence, postDetailRecurrence,
    postPatientNumber
}