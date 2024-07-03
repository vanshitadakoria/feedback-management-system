import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { getCustomerAdminsCount, getCustomerUsersCount, getQuestionBanksCount, getQuestionnaireBanksCount } from '../../services/count';

export default function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [countQuestionnaireBanks,setCountQuestionnaireBanks] = useState(0);
  const [countQuestionBanks,setCountQuestionBanks] = useState(0);
  const [countCustomerAdmins,setCountCustomerAdmins] = useState(0);
  const [countCustomerUsers,setCountCustomerUsers] = useState(0);

  useEffect(() => {
    const fetchDataFromApi = async () => {
        try {
            const apiData1 = await getQuestionnaireBanksCount();
            setCountQuestionnaireBanks(apiData1);
            const apiData2 = await getQuestionBanksCount();
            setCountQuestionBanks(apiData2);
            const apiData3 = await getCustomerAdminsCount();
            setCountCustomerAdmins(apiData3);
            const apiData4 = await getCustomerUsersCount();
            setCountCustomerUsers(apiData4);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchDataFromApi();
}, []);
  

  return (
    <Box m='20px'>
      <Header title="Dashboard" subtitle="" />
      <Grid container spacing={2}> {/* Use Grid container */}
          <Grid item  xs={12} sm={6} md={4} lg={3}> {/* Adjust grid item size based on screen size */}
            <Box
              p={2}
              border="3px solid #ccc"
              borderRadius="8px"
              textAlign="center"
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              bgcolor={colors.blueAccent[700]}
            >
              <Link
                to={`/superadmin/questionnairebanks`}
                style={{
                  textDecoration: 'none',
                  color: colors.primary[300]
                }}
              >
                <h1>QuestionnaireBanks</h1>
                <h2>{countQuestionnaireBanks}</h2>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}> {/* Adjust grid item size based on screen size */}
            <Box
              p={2}
              border="3px solid #ccc"
              borderRadius="8px"
              textAlign="center"
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              bgcolor={colors.blueAccent[700]}
            >
              <Link
                to={`/superadmin/questionbanks`}
                style={{
                  textDecoration: 'none',
                  color: colors.primary[300]
                }}
              >
                <h1>QuestionBanks</h1>
                <h2>{countQuestionBanks}</h2>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}> {/* Adjust grid item size based on screen size */}
            <Box
              p={2}
              border="3px solid #ccc"
              borderRadius="8px"
              textAlign="center"
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              bgcolor={colors.blueAccent[700]}
            >
              <Link
                to={`/superadmin/customeradmins`}
                style={{
                  textDecoration: 'none',
                  color: colors.primary[300]
                }}
              >
                <h1>CustomerAdmins</h1>
                <h2>{countCustomerAdmins}</h2>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}> {/* Adjust grid item size based on screen size */}
            <Box
              p={2}
              border="3px solid #ccc"
              borderRadius="8px"
              textAlign="center"
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              bgcolor={colors.blueAccent[700]}
            >
              <Link
                to={`/superadmin/customerusers`}
                style={{
                  textDecoration: 'none',
                  color: colors.primary[300]
                }}
              >
                <h1>CustomerUsers</h1>
                <h2>{countCustomerUsers}</h2>
              </Link>
            </Box>
          </Grid>
      </Grid>
    </Box>
  )
}
