import React from 'react'
import Header from '../../../components/Header'
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { useState, useEffect } from 'react';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { editQuestionnaire, editQuestionnaireStatus, getAllQuestionnaires, getAllQuestionnairesByCustomerAdminId, getCustomerAdminById, postQuestionnaire } from '../../../services/customeradmin';
import { Link } from 'react-router-dom';
import { getCurrentLoggedInUser } from '../../../services/authentication';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {

  const [data, setData] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;


  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const apiData = await getCustomerAdminById(CustomerAdminId);
        setQuestionnaires(apiData.questionnaires);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataFromApi();
  }, []);

  useEffect(() => {
    setData(questionnaires.map((row, index) => ({
      ...row,
      id: index + 1,
      isNew: false
    })));
  }, [questionnaires]); // Run this effect whenever questionnaires changes

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const onSaveRow = async (id, updatedRow, oldRow, oldRows) => {


    if (updatedRow.isNew) {
      //Post call
      try {

        const newQuestionnaire = {
          questionnaireTitle: updatedRow.questionnaireTitle,
          customerAdminId: CustomerAdminId,
        }
        const response = await postQuestionnaire(newQuestionnaire)
        console.log(response);
        // Fetch updated data from API
        const updatedData = await getAllQuestionnairesByCustomerAdminId(CustomerAdminId);
        setData(updatedData.map((row, index) => ({ ...row, id: index + 1, isNew: false })));

        toast.success('New questionnaire added successfully.');
      } catch (error) {
        console.error('Error posting newQuestionnaire :', error);
        toast.error('Failed to add new questionnaire .');
      }
    } else {
      //Edit call
      try {
        // console.log(oldRow.questionnaireId,"update qb : ", updatedRow);
        const apiData = await editQuestionnaire(oldRow.questionnaireId, updatedRow)
        console.log(apiData);
        toast.success('Questionnaire updated successfully.');
      } catch (error) {
        console.error('Error updating Questionnaire :', error);
        toast.error('Failed to update questionnaire .');

      }
    }
  };


  const onDeleteRow = async (id) => {
    try {
      const updatedRow = data.find(row => row.id === id);
      if (updatedRow) {
        await editQuestionnaireStatus(updatedRow.questionnaireId, 'inactive');
        // setData(data.map(row => row.questionnaireBankId === id ? { ...row, status: 'inactive' } : row));
        //setData(prevData => prevData.map(r => r.questionnaireBankId === id ? updatedRow : r));
        setData(data.map(row => row.id === id ? { ...row, status: 'inactive' } : row));
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };
  const handleActivate = async (id, row) => {
    try {
      const updatedRow = { ...row, status: "active" };
      const apiData = await editQuestionnaireStatus(row.questionnaireId, 'active');
      setData(prevData => prevData.map(r => r.questionnaireId === id ? updatedRow : r));
      console.log(apiData);
    } catch (error) {
      console.error('Error activating row:', error);
    }
  };


  const columns = [
    {
      field: "questionnaireId",
      headerName: "questionnaireId",
      flex: 0.2,      //Changed by vanshita on 1-05-2024
    },
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,      //Changed by vanshita on 1-05-2024
    },
    {
      field: "questionnaireTitle",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
      renderCell: (params) => (
        <Link to={`/customeradmin/questionnaire/${params.row.questionnaireId}`}
          style={{ textDecoration: 'none', color: 'inherit', fontSize: '11pt' }}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
  ];

  const inactiveColumns = [
    ...columns.filter(col => col.field !== 'actions'),
    {
      field: 'activate',
      headerName: 'Activate',
      flex: 1,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={() => handleActivate(params.row.questionnaireId, params.row, 'active')}>
          Activate
        </Button>
      )
    }
  ];

  // const getRowId = (row) => row.questionnaireBankId;

  return (
    <div>
      <Box m="20px">
        <Header
          title="Questionnaires"
          subtitle="List of Questionnaires for Feedback Collection"
        />
        <Box m="20px 0">
          <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)} indicatorColor="secondary" textColor="secondary">
            <Tab label="Active QuestionnaireBanks" />
            <Tab label="Inactive QuestionnaireBanks" />
          </Tabs>
        </Box>
        {tabIndex === 0 && (<Box
          m="40px 0 0 0"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              display: 'flex',
              width: "99%",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: 14,    //Added by Vanshita on 1-05-2024
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
              fontSize: 14,    //Added by Vanshita on 1-05-2024
            },
            "& ::-webkit-scrollbar": {
              width: '0px',
              background: 'transparent', /* make scrollbar transparent */
            },
            "& .MuiDataGrid-virtualScroller": {
              maxHeight: '300px',
              width: 'inherit',
              overflowY: 'auto !important',
              overflowX: 'hidden !important',

              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            // "& .MuiDataGrid-toolbarContainer ": {
            //   display: 'none'
            // },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },

          }}
        >

          {/* <FullEditDataGrid
            columns={columns}
            rows={data}
            onSaveRow={onSaveRow}
            columnVisibilityModel={{
              questionnaireId: false,
          }}
          // onDeleteRow={onDeleteRow}
          // createRowData={createRowData}
          /> */}


          <FullEditDataGrid
            columns={columns}
            rows={data.filter(row => row.status !== 'inactive')}
            onSaveRow={onSaveRow}
            onDeleteRow={onDeleteRow}
            columnVisibilityModel={{
              questionnaireId: false,
            }}
          />
        </Box>

        )}
        {tabIndex === 1 && (
          <Box
            m="40px 0 0 0"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                display: 'flex',
                width: "99%",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
                fontSize: 14,    //Added by Vanshita on 1-05-2024
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
                fontSize: 14,    //Added by Vanshita on 1-05-2024
              },
              "& ::-webkit-scrollbar": {
                width: '0px',
                background: 'transparent', /* make scrollbar transparent */
              },
              "& .MuiDataGrid-virtualScroller": {
                maxHeight: '370px',
                width: 'inherit',
                overflowY: 'auto !important',
                overflowX: 'hidden !important',

                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              // "& .MuiDataGrid-toolbarContainer ": {
              //   display: 'none'
              // },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
              "& .css-13qp4b7-MuiButtonBase-root-MuiButton-root": {    //Added on 03-06-2024
                display: 'none'
              }
            }}
          >

            <FullEditDataGrid
              columns={inactiveColumns}
              rows={data.filter(row => row.status === 'inactive')}
              onSaveRow={onSaveRow}
              onDeleteRow={onDeleteRow}
              columnVisibilityModel={{
                questionnaireId: false,
              }}
              noActionColumn
            />
          </Box>
        )}
        <ToastContainer />
      </Box>
    </div >
  )
}
