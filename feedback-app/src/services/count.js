import axios from "axios"

const apiURL = "https://localhost:7163/api"

//[GET] Call to fetch QuestionnaireBanksCount
export const getQuestionnaireBanksCount = async () => {
    try {
        const response = await axios.get(`${apiURL}/Count/QuestionnaireBanksCount`)
        return response.data;
    } catch (error) {
        console.error('Error fetching QuestionnaireBanksCount :', error);
        throw error;
    }
}
//[GET] Call to fetch QuestionBanksCount
export const getQuestionBanksCount = async () => {
    try {
        const response = await axios.get(`${apiURL}/Count/QuestionBanksCount`)
        return response.data;
    } catch (error) {
        console.error('Error fetching QuestionBanksCount :', error);
        throw error;
    }
}
//[GET] Call to fetch CustomerAdminsCount
export const getCustomerAdminsCount = async () => {
    try {
        const response = await axios.get(`${apiURL}/Count/CustomerAdminsCount`)
        return response.data;
    } catch (error) {
        console.error('Error fetching CustomerAdminsCount :', error);
        throw error;
    }
}
//[GET] Call to fetch CustomerUsersCount
export const getCustomerUsersCount = async () => {
    try {
        const response = await axios.get(`${apiURL}/Count/CustomerUsersCount`)
        return response.data;
    } catch (error) {
        console.error('Error fetching CustomerUsersCount :', error);
        throw error;
    }
}