import axios from "axios"

const apiURL = "https://localhost:7163/api"

// Set the default Authorization header for Axios
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;


//[GET] Call to fetch CustomerUserById
export const getCustomerUserById = async (customerId) => {
    try {
        const response = await axios.get(`${apiURL}/CustomerUsers/${customerId}`)
        return response.data;
    } catch (error) {
        console.error(`Error fetching CustomerUser for id : ${customerId} :`, error);
        throw error;
    }
}

//[POST] Call to post new FeedbackMaster
export const postFeedbackMaster = async (newFeedbackMaster) => {
    try {

        const response = await axios.post(`${apiURL}/FeedbackMasters`, newFeedbackMaster)
        return response.data;
    } catch (error) {
        console.error('Error posting into FeedbackMaster :', error);
        throw error;
    }
}

//[POST] Call to post new FeedbackDetails
export const postFeedbackDetails = async (newFeedbackDetails) => {
    try {

        const response = await axios.post(`${apiURL}/FeedbackDetails`, newFeedbackDetails)
        return response.data;
    } catch (error) {
        console.error('Error posting into FeedbackDetails :', error);
        throw error;
    }
}

//[POST] Call to login CustomerAdmin and CustomerUser
export const loginCustomerUser = async (customerTokenId, password) => {
    try {
      console.log("data :",customerTokenId,"-",password)
        // const response = await axios.get(`${apiURL}/CustomerUsers/login?customerTokenId=${customerTokenId}&password=${password}`);
        const response = await axios.post(`${apiURL}/auth/login`,{customerTokenId, password});
        //console.log("response", response);
        return response.data;

    } catch (error) {
        console.error('Error logging in CustomerUser/CustomerAdmin:', error);
        throw error;
    }
}

//[GET] Call to fetch feedbackDetailsByCustomerUser
//Added this method 03-06-24
export const getFeedbackDetailsByCustomerUser = async (customerUserId) => {
    try {
      const response = await axios.get(`${apiURL}/FeedbackDetails/ByCustomerUserId/${customerUserId}`);
    //   console.log("response",response);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback Details By CustomerUser :', error);
      return [];
    }
  };

  export const GetFeedbackMastersByCustomerUser = async (customerUserId) => {
    try {
      const response = await axios.get(`${apiURL}/FeedbackMasters/GetFeedbackMastersByCustomerUser/${customerUserId}`);
    //   console.log("response",response);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  //[PUT] Call to update customeruserupdatestatus
  export const updateCustomerUserStatus = async (customerUserId, status) => {
    try {
        const response = await axios.put(`${apiURL}/CustomerUsers/updateStatus/${customerUserId}`, status, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating customer user status:', error);
        throw error;
    }
   

};