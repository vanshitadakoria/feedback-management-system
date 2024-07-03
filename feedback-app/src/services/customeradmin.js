import axios from "axios"

const apiURL = "https://localhost:7163/api"

//[GET] Call to fetch QuestionnaireBanks
export const getAllQuestionnaireBanks = async () => {
    try {
        const response = await axios.get(`${apiURL}/Questionnaires`)
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnaires :', error);
        throw error;
    }
}

//[GET] Call to fetch allQuestionnaires
export const getAllQuestionnaires = async () => {
    try {
        const response = await axios.get(`${apiURL}/Questionnaires`)
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnaires :', error);
        throw error;
    }
}
//[GET] Call to fetch allQuestionnairesByCustomerAdminId
export const getAllQuestionnairesByCustomerAdminId = async (customerAdminId) => {
    try {
        const response = await axios.get(`${apiURL}/Questionnaires/questionnairesByCustomerAdminId/${customerAdminId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnairesByCustomerAdminId :', error);
        throw error;
    }
}



//[GET] Call to fetch QuestionnaireById
export const getQuestionnaireById = async (id) => {
    try {
        const response = await axios.get(`${apiURL}/Questionnaires/${id}`)
        return response.data;
    } catch (error) {
        console.error(`Error fetching questionnaire for id: ${id} :`, error);
        throw error;
    }
}

//[GET] Call to fetch QuestionnaireByCustomerAdminId
export const getQuestionnaireByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(`${apiURL}/Questionnaires/questionnaireByCustomerId/${customerId}`)
        return response.data;
    } catch (error) {
        console.error(`Error fetching questionnaire for customerId: ${customerId} :`, error);
        throw error;
    }
}
//[GET] Call to fetch CustomerAdminById
export const getCustomerAdminById = async (customerId) => {
    try {
        const response = await axios.get(`${apiURL}/CustomerAdmins/${customerId}`)
        return response.data;
    } catch (error) {
        console.error(`Error fetching CustomerAdmin for id : ${customerId} :`, error);
        throw error;
    }
}

//[POST] Call to post new Questionnaire
export const postQuestionnaire = async (newQuestionnaire) => {
    try {

        const response = await axios.post(`${apiURL}/Questionnaires`, newQuestionnaire)
        return response.data;
    } catch (error) {
        console.error('Error posting questionnaire :', error);
        throw error;
    }
}

//[PUT] Call to update Questionnaire
export const editQuestionnaire = async (id, updatedQuestionnaire) => {
    try {
        const response = await axios.put(`${apiURL}/Questionnaires/${id}`, updatedQuestionnaire)
        return response.data;
    } catch (error) {
        console.error('Error updating questionnaire :', error);
        throw error;
    }
}
//[PUT] Call to update editQuestionnaireStatus
export const editQuestionnaireStatus = async (questionnaireId, status) => {
    try {
      const response = await axios.put(`${apiURL}/Questionnaires/updateStatus/${questionnaireId}`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
      console.error('Error updating Questionnaire Status:', error);
      throw error;
    }
  };
//[PUT] Call to update editQuestionStatus
export const editQuestionStatus = async (questionId, status) => {
    try {
      const response = await axios.put(`${apiURL}/Questions/updateStatus/${questionId}`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
      console.error('Error updating Question Status:', error);
      throw error;
    }
  };

//[GET] Call to fetch CategoryByName
export const getCategoryByName = async (name) => {
    try {
        const response = await axios.get(`${apiURL}/QuestionCategories/CategoryByName/${name}`)
        return response.data;
    } catch (error) {
        console.error(`Error fetching Question Category for name ${name} :`, error);
        throw error;
    }
}

//[GET] Call to fetch QuestionsByCategoryId and CustomerAdminId
export const getQuestionsByCategoryId = async (categoryId, customerAdminId) => {
    try {
        const response = await axios.get(`${apiURL}/Questions/questionByCategoryId?questionCategoryId=${categoryId}&customerAdminId=${customerAdminId}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching Questions By CategoryId:', error);
        throw error;
    }
}
//[GET] Call to fetch QuestionsByCategoryId 
export const getQuestionByCategoryId = async (categoryId) => {
    try {
        const response = await axios.get(`${apiURL}/Questions/questionbycategory/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Questions By CategoryId:', error);
        throw error;
    }
}

//[POST] Call to post new Question
export const postQuestion = async (newQuestion) => {
    try {
        const response = await axios.post(`${apiURL}/Questions`, newQuestion)
        return response.data;
    } catch (error) {
        console.error('Error posting question :', error);
        throw error;
    }
}
//[PUT] Call to update Question
export const editQuestion = async (id, updatedQuestion) => {
    try {
        // return axios.post(`${apiURL}/Questions`, newQuestion);
        const response = await axios.put(`${apiURL}/Questions/${id}`, updatedQuestion)
        return response.data;
    } catch (error) {
        console.error('Error updating question :', error);
        throw error;
    }
}

//[DELETE] Call to delete Question
export const deleteQuestion = async (idToDelete) => {
    try {
        const response = await axios.delete(`${apiURL}/Questions/${idToDelete}`)
        return response.data;
    } catch (error) {
        console.error('Error deleting question :', error);
        throw error;
    }
}

//[POST] Call to post new QuestionnaireQuestion
export const postQuestionnaireQuestion = async (newQuestionnaireQuestion) => {
    try {
        console.log("newQuestionnaireQuestion", newQuestionnaireQuestion);
        const response = await axios.post(`${apiURL}/QuestionnaireQuestions`, newQuestionnaireQuestion)
        return response.data;

    } catch (error) {
        console.error('Error posting new QuestionnaireQuestion  :', error);
        throw error;
    }
}
//[PUT] Call to update QuestionnaireQuestion
export const editQuestionnaireQuestion = async (id, updatedQuestionnaireQuestion) => {
    try {
        console.log("updatedQuestionnaireQuestion", updatedQuestionnaireQuestion);
        const response = await axios.put(`${apiURL}/QuestionnaireQuestions/${id}`, updatedQuestionnaireQuestion)
        return response.data;

    } catch (error) {
        console.error('Error updating QuestionnaireQuestion  :', error);
        throw error;
    }
}



//[GET] Call to fetch QuestionnaireQuestion By questionId 
export const getQuestionnaireQuestionByQuestionId = async (questionId) => {
    try {
        const response = await axios.get(`${apiURL}/QuestionnaireQuestions/QuestionnaireQuestion/${questionId}`)
        return response.data;

    } catch (error) {
        console.error('Error fetching QuestionnaireQuestion  :', error);
        throw error;
    }
}
//[DELETE] Call to delete QuestionnaireQuestion By questionId
export const deleteQuestionnaireQuestionByQuestionId = async (questionId) => {
    try {
        const response = await axios.delete(`${apiURL}/QuestionnaireQuestions/DeleteByQuestionId/${questionId}`)
        return response.data;

    } catch (error) {
        console.error('Error deleting QuestionnaireQuestion  :', error);
        throw error;
    }
}

//[POST] Call to post new CustomerUser
export const postCustomerUser = async (newCustomerUser) => {
    try {
        const response = await axios.post(`${apiURL}/CustomerUsers`, newCustomerUser)
        return response.data;
    } catch (error) {
        console.error('Error posting Customer User :', error);
        throw error;
    }
}

//[GET] Call to fetch CustomerUsers
export const getAllCustomerUsers = async () => {
    try {
        const response = await axios.get(`${apiURL}/CustomerUsers`)
        return response.data;
    } catch (error) {
        console.error('Error fetching Customer Users :', error);
        throw error;
    }
}

//[GET] Call to fetch CustomerUsersByCustomerAdmin
export const getCustomerUsersByCustomerAdmin = async (customerAdminId) =>{
    try {
        const response = await axios.get(`${apiURL}/CustomerUsers/byAdmin/${customerAdminId}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching Customer Users as per customer admin :', error);
        throw error;
    }
}

//[POST] Call to post new QuestionnaireAssignment
export const postQuestionnaireAssignment = async (questionnaireassignments) => {
    try {
        const response = await axios.post(`${apiURL}/QuestionnaireAssignments`, questionnaireassignments)
        return response.data;
    } catch (error) {
        console.error('Error posting QuestionnaireAssignment :', error);
        throw error;
    }
}

//[GET] Call to fetch QuestionnaireAssignments
export const getAllQuestionnaireAssignments = async () => {
    try {
        const response = await axios.get(`${apiURL}/QuestionnaireAssignments`)
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnaire Assignments :', error);
        throw error;
    }
}

//[GET] Call to fetch QuestionnaireAssignments
export const getAllQuestionnaireAssignmentsByCustomerUserId = async (customerUserId) => {
    try {
        const response = await axios.get(`${apiURL}/QuestionnaireAssignments/QuestionnairesByCustomerUserId/${customerUserId}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnaires by customerUserId :', error);
        throw error;
    }
}

export const GetFeedbackDetailsByCustomerAdminId = async (customerAdminId) => {
    try {
        const response = await axios.get(`${apiURL}/FeedbackDetails/ByCustomerAdminId/${customerAdminId}`);
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

//[GET] Call to fetch GetFeedbackMastersByCustomerAdmin 
export const GetFeedbackMastersByCustomerAdmin = async (customerAdminId) => {
    try {
        const response = await axios.get(`${apiURL}/FeedbackMasters/GetFeedbackMastersByCustomerAdmin/${customerAdminId}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching FeedbackMastersByCustomerAdmin:', error);
        return [];
    }
};

//[GET] Call to fetch FeedbackMasterById 
export const GetFeedbackMasterById = async (feedbackMasterId) => {
    try {
        const response = await axios.get(`${apiURL}/FeedbackMasters/${feedbackMasterId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching FeedbackMasterById:', error);
        return [];
    }
};

//[PUT] Call to update customerAdminsupdatestatus
export const UpdateCustomerAdminsStatus = async (customerAdminsId, status) => {
    try {
        const response = await axios.put(`${apiURL}/CustomerAdmins/updateStatus/${customerAdminsId}`, status, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating customer admin status:', error);
        throw error;
    }
}