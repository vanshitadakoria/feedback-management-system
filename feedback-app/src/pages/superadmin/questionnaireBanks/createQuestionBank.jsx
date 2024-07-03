import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';
import { deleteQuestionBank, deleteQuestionnaireQuestionBankByQuestionBankId, editQuestionBank, editQuestionnaireQuestionBank, getQuestionnaireQuestionBankByQuestionBankId, postQuestionBank, postQuestionnaireQuestionBank } from '../../../services/superadmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentLoggedInUser } from '../../../services/authentication';
import { useNavigate } from 'react-router-dom';


// const getRowId = (row) => row.srNo;


export default function CreateQuestionBank({ questionCategoryId, questions, questionnaireBankId }) {
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();


    const SuperAdminId = getCurrentLoggedInUser().superAdminId;


    useEffect(() => {
        async function fetchData() {
            try {
                // const data = await getQuestionsByCategoryId(questionCategoryId);
                //const superadminbyname =  await getSuperadminByid();
                setRows(questions.map((row, index) => ({ ...row, id: index + 1, isNew: false })));
            } catch (error) {
                console.error('Error fetching question banks:', error);
            }
        }
        fetchData();
    }, []);


    const onSaveRow = async (id, updatedRow, oldRow, oldRows) => {
        //console.log(updatedRow);

        if (updatedRow.isNew) {
            const newQuestionBank = {
                questionBankText: updatedRow.questionBankText,
                questionCategoryId: questionCategoryId,
                superAdminId: 1,
            }
            //Post call
            try {
                const apiData = await postQuestionBank(newQuestionBank);
                console.log(apiData);

                const newQuestionnaireQuestionBank = {
                    questionnaireBankId: questionnaireBankId,
                    questionBankId: apiData.questionBankId,
                    superAdminId: 1,
                    serialNo: updatedRow.serialNo,
                }
                // console.log(newQuestionnaireQuestionBank);

                const response = await postQuestionnaireQuestionBank(newQuestionnaireQuestionBank)
                console.log(response);
                // Update the rows state directly with the new data
                setRows(prevRows => [
                    ...prevRows,
                    { ...updatedRow, ...apiData, isNew: false }
                ]);
                toast.success('Row added successfully!');
            } catch (error) {
                console.error('Error posting newQuestion :', error);
                toast.error('Failed to add row!');
            }
        } else {
            //Edit call
            try {
                const apiData = await editQuestionBank(oldRow.questionBankId, updatedRow)
                console.log(apiData);

                const response = await getQuestionnaireQuestionBankByQuestionBankId(oldRow.questionBankId);
                console.log("response :", response);

                const updatedQuestionnaireQuestionBank = {
                    questionnaireQuestionBankId: response.questionnaireQuestionBankId,
                    questionnaireBankId: questionnaireBankId,
                    questionBankId: oldRow.questionBankId,
                    superAdminId: SuperAdminId,
                    serialNo: updatedRow.serialNo,
                    status: 'active'
                };

                const updateResponse = await editQuestionnaireQuestionBank(response.questionnaireQuestionBankId, updatedQuestionnaireQuestionBank);
                console.log("updateResponse", updateResponse);

                setRows(prevRows => prevRows.map(row => row.id === id ? { ...updatedRow, isNew: false } : row));
                toast.success('Row edited successfully!');

            } catch (error) {
                console.error('Error updating QuestionBank :', error);
                toast.error('Failed to edit row!');
            }
        }

    };


    const onDeleteRow = async (id, oldRow, oldRows) => {
        try {
            //console.log(oldRow.questionBankId);
            const response = await deleteQuestionnaireQuestionBankByQuestionBankId(oldRow.questionBankId);
            console.log(response);
            const apiData = await deleteQuestionBank(oldRow.questionBankId);
            console.log(apiData);

            setRows(oldRows.filter(row => row.id !== id));
            toast.success('Row deleted successfully!');
        } catch (error) {
            console.error('Error deleting QuestionBank :', error);
            toast.error('Failed to delete row!');
        }
    };
    const createRowData = (rows) => {
        console.log("all rows", rows);

        // Get the maximum ID from the existing rows and add 1, default to 1 if rows is empty
        const newId = rows.length > 0 ? Math.max(...rows.map((r) => (r.id ? r.id : 0))) + 1 : 1;

        return { id: newId, questionText: '', serialNo: '', isNew: true, questionCategoryId: questionCategoryId };
    };

    const columns = [
        {
            field: 'questionBankId',
            headerName: 'questionBankID',
            flex: 0.2,
        },
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.2,
        },
        {
            field: 'questionBankText',
            headerName: 'Question Text',
            flex: 1,
            editable: true
        },
        {
            field: 'serialNo',
            headerName: 'Serial No',
            flex: 0.5,
            editable: true
        },
    ];

    return (
        <Box
            sx={{
                // height: 300,
                width: '90%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                // Added by Vanshita on 7-05-2024
                '& .MuiDataGrid-toolbarContainer': {
                    backgroundColor: colors.grey[500],
                    // backgroundColor:colors.blueAccent[600], 
                },
                "& .MuiDataGrid-virtualScroller": {
                    maxHeight: '350px',
                    width: 'inherit',
                    overflowY: 'auto !important',
                    overflowX: 'hidden !important',
                    // backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-cell": {
                    fontSize: 13,
                },
                "& .MuiDataGrid-columnHeaders": {
                    fontSize: 14,
                    backgroundColor: colors.grey[600],
                    // backgroundColor:colors.blueAccent[700], 
                    fontWeight: "bold"
                },
                //Ended
            }}
        >
            <FullEditDataGrid
                columns={columns}
                rows={rows}
                onSaveRow={onSaveRow}
                onDeleteRow={onDeleteRow}
                createRowData={createRowData}

                //Added by vanshita on 7-05-2024
                columnVisibilityModel={{
                    questionBankId: false,
                }}

            />
            <ToastContainer />
        </Box>
    );
}