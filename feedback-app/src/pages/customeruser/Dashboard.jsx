import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import Header from '../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import FullEditDataGrid from 'mui-datagrid-full-edit';
import dayjs from 'dayjs';
import { GetFeedbackMastersByCustomerUser } from '../../services/customeruser';
import { getCurrentLoggedInUser } from '../../services/authentication';

const Dashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const customerUserId = getCurrentLoggedInUser().customerUserId;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetFeedbackMastersByCustomerUser(customerUserId);
        const data = response.map((row, index) => ({ ...row, id: index + 1, isNew: false }));
        //  const datas = processFeedbackData(data);
        console.log("datas", data);
        setFeedbackData(data);
        setFilteredData(data);
        console.log("feedbackdata", response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const filterData = (date) => {
    const filtered = feedbackData.filter((item) => {
      const feedbackDate = dayjs(item.feedbackDate).startOf('day');
      return feedbackDate.isSame(date, 'day');
    });
    setFilteredData(filtered);
  };

  const handleTodayClick = () => {
    const today = dayjs().startOf('day');
    filterData(today);
  };

  const handleYesterdayClick = () => {
    const yesterday = dayjs().subtract(1, 'day').startOf('day');
    filterData(yesterday);
  };

  const handleDateChange = (event) => {
    const date = dayjs(event.target.value).startOf('day');
    setSelectedDate(date);
    filterData(date);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const columns = [
    {
      field: "personName",
      headerName: "Person Name",
      flex: 0.5,
      renderCell: (params) => params.row.personName || 'NA'
    },
    {
      field: "personContactNo",
      headerName: "Person Contact",
      flex: 0.5,
      renderCell: (params) => params.row.personContactNo || 'NA'
    },
    {
      field: "dateOfBirth",
      headerName: "Date Of Birth",
      flex: 0.5,
      renderCell: (params) => params.row.dateOfBirth || 'NA'
    },
    {
      field: "feedbackDate",
      headerName: "Feedback Date",
      flex: 0.3,
      renderCell: (params) => formatDate(params.row.feedbackDate) || 'NA'
    },

  ];

  return (
    <Box m='20px'>
      <Header title="Display" subtitle="Details About End Users" />
      <Box display="flex" justifyContent="left" mb="20px">
        <Button variant="contained" color="secondary" onClick={handleTodayClick}>
          Today
        </Button>
        <Button variant="contained" color="secondary" onClick={handleYesterdayClick}>
          Yesterday
        </Button>
        <TextField
          type="date"
          label="Select Date"
          InputLabelProps={{ shrink: true }}
          onChange={handleDateChange}
          value={selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}
        />
      </Box>
      <Box
        m="40px 0 0 0"
        // height="60vh"
        width="98%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: 14,
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
            textDecoration: 'none',
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            fontSize: 14,
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowY: 'auto !important',
            overflowX: 'hidden !important',
            height:'300px',
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer ": {
            display: 'none'
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >

        {/* <Box height="75vh"> */}
          <FullEditDataGrid rows={filteredData} columns={columns} noActionColumn autoHeight  />
        {/* </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;