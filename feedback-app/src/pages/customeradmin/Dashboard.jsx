import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { GetFeedbackDetailsByCustomerAdminId } from '../../services/customeradmin';
import EndUserReport from './reports/EndUserReport';
import QuestionReport from './reports/QuestionReport';
import QuestionRatingChart from './reports/QuestionRatingChart';
import Header from '../../components/Header';
import { getCurrentLoggedInUser } from '../../services/authentication';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [categoryAverageRatings, setCategoryAverageRatings] = useState({});
  const [selectedTab, setSelectedTab] = useState('average'); // State to manage selected tab

  const customerAdminId = getCurrentLoggedInUser().customerAdminId;

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        const feedbackResponse = await GetFeedbackDetailsByCustomerAdminId(customerAdminId);
        setFeedbackData(feedbackResponse);

        // Calculate category-wise average ratings
        const categoryRatings = {};
        feedbackResponse.forEach((feedback) => {
          const { question, responseRating } = feedback;
          const categoryId = question.questionCategory.questionCategoryId;
          const categoryName = question.questionCategory.categoryName;

          if (!categoryRatings[categoryId]) {
            categoryRatings[categoryId] = { categoryName, totalRating: 0, count: 0 };
          }
          categoryRatings[categoryId].totalRating += responseRating;
          categoryRatings[categoryId].count += 1;
        });

        const averageRatings = {};
        for (const categoryId in categoryRatings) {
          const { categoryName, totalRating, count } = categoryRatings[categoryId];
          averageRatings[categoryName] = totalRating / count;
        }
        setCategoryAverageRatings(averageRatings);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [customerAdminId]);

  // Prepare data for BarChart
  const data = Object.keys(categoryAverageRatings).map((categoryName) => ({
    category: categoryName,
    averageRating: categoryAverageRatings[categoryName]
  }));

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Box m="20px">
        <Header title="Dashboard" subtitle="" />
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="secondary"
          textColor="secondary">

          <Tab label="Average Rating" value="average" />
          <Tab label="Questions Report" value="questionReport" />
          <Tab label="EndUsers Report" value="userReport" />
          <Tab label="Question Rating Chart" value="QuestionRatingChart" />
        </Tabs>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : selectedTab === 'average' ? (
        <Box m='20px'>
          <Header m="20px" title="Average Rating" subtitle="Category Wise Average Rating" />

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <BarChart

              width={600}
              height={400}
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageRating" fill="#8884d8" />
            </BarChart>
          </Box>
        </Box>


      ) : selectedTab === 'questionReport' ? (
        <QuestionReport/>
      ) : selectedTab === 'userReport' ? (
        <EndUserReport/>
      ) : selectedTab === 'QuestionRatingChart' ? (
        <QuestionRatingChart />
      ) : null}


    </div>
  );
};

export default Dashboard;