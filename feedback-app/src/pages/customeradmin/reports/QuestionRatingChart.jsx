import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { GetFeedbackDetailsByCustomerAdminId, getQuestionByCategoryId, getQuestionsByCategoryId } from '../../../services/customeradmin';
import { getAllCategories } from '../../../services/superadmin';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import Header from '../../../components/Header';
import { getCurrentLoggedInUser } from '../../../services/authentication';

const QuestionRatingChart = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState({});
  const [feedbackData, setFeedbackData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;

  useEffect(() => {
    const fetchCategoriesAndQuestions = async () => {

      try {
        const categories = await getAllCategories();
        const filteredCategories = [];
        const questions = {};

        for (const category of categories) {
          const categoryQuestions = await getQuestionsByCategoryId(category.questionCategoryId, CustomerAdminId);
          if (categoryQuestions.length > 0) {
            filteredCategories.push(category);
            questions[category.questionCategoryId] = categoryQuestions;
          }
        }

        setCategories(filteredCategories);
        setQuestions(questions);
      } catch (error) {
        console.error('Error fetching data', error);
      }

    };

    fetchCategoriesAndQuestions();

    const fetchData = async () => {
      try {
        const response = await GetFeedbackDetailsByCustomerAdminId(CustomerAdminId);
        setFeedbackData(response);
      } catch (error) {
        console.error('Error fetching GetFeedbackDetailsByCustomerAdminId:', error);
      }
    };

    fetchData();
  }, [CustomerAdminId]);

  const countRatings = (feedbackDetails) => {
    const counts = Array(6).fill(0);
    feedbackDetails.forEach(detail => {
      if (detail.responseRating >= 0 && detail.responseRating <= 5) {
        counts[detail.responseRating]++;
      }
    });
    return counts;
  };

  const generateChartData = useCallback(() => {
    const data = categories.map(category => {
      const categoryQuestions = questions[category.questionCategoryId] || [];
      const categoryData = {
        categoryName: category.categoryName,
      };
      categoryQuestions.forEach(question => {
        const relevantFeedback = feedbackData.filter(feedback => feedback.questionId === question.questionId);
        const ratings = countRatings(relevantFeedback);
        for (let i = 0; i <= 5; i++) {
          categoryData[`rating${i}`] = (categoryData[`rating${i}`] || 0) + ratings[i];
        }
      });
      categoryData.totalRating = Object.values(categoryData).slice(1).reduce((total, rating) => total + rating, 0);
      return categoryData;
    });
    return data;
  }, [categories, questions, feedbackData]);

  useEffect(() => {
    if (feedbackData.length > 0) {
      const processedData = generateChartData();
      setChartData(processedData);
    }
  }, [feedbackData, categories, questions, generateChartData]);

  return (
    <Box m="20px">
      <Header title="Question Rating" subtitle="How many Rating " />
      <Box sx={styles.chartContainer}>
        {chartData.length > 0 ? (
          <BarChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoryName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating0" stackId="a" fill="#8884d8" />
            <Bar dataKey="rating1" stackId="a" fill="#82ca9d" />
            <Bar dataKey="rating2" stackId="a" fill="#ffc658" />
            <Bar dataKey="rating3" stackId="a" fill="#f28f43" />
            <Bar dataKey="rating4" stackId="a" fill="#d46e37" />
            <Bar dataKey="rating5" stackId="a" fill="#ff7300" />
          </BarChart>
        ) : (
          <CircularProgress sx={{ backgroundColor: 'white', color: 'white' }} />
        )}
      </Box>
    </Box>

  );
};

const styles = {
  headerContainer: {
    marginBottom: 2,
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  accordionContainer: {
    marginBottom: 2,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
  },
  dataGridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default QuestionRatingChart;