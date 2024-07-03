import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { deleteQuestionBank, editQuestionBank, getQuestionBanksByCategoryId, postQuestionBank } from '../../../services/superadmin';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';


// const getRowId = (row) => row.srNo;


export default function Index({ questionCategoryId }) {
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);



    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const data = await getAllQuestionBanks();
    //             //const superadminbyname =  await getSuperadminByid();
    //             setRows(data.map((row, index) => ({ ...row, id: index + 1, isNew: false }))); // Assigning srNo starting from
    //         } catch (error) {
    //             console.error('Error fetching question banks:', error);
    //         }
    //     }
    //     fetchData();
    // }, []);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getQuestionBanksByCategoryId(questionCategoryId);
                //const superadminbyname =  await getSuperadminByid();
                setRows(data.map((row, index) => ({ ...row, id: index + 1, isNew: false }))); // Assigning srNo starting from
            } catch (error) {
                console.error('Error fetching question banks:', error);
            }
        }
        fetchData();
    }, []);


    const onSaveRow = async (id, updatedRow, oldRow, oldRows) => {
        //console.log(updatedRow);
        const newQuestionBank = {
            questionBankText: updatedRow.questionBankText,
            questionCategoryId: questionCategoryId,
            superAdminId: 1,
        }
        if (updatedRow.isNew) {
            //Post call
            try {
                const apiData = await postQuestionBank(newQuestionBank);
                console.log(apiData);
            } catch (error) {
                console.error('Error posting newQuestionBank :', error);
            }
        } else {
            //Edit call
            try {
                const apiData = await editQuestionBank(oldRow.questionBankId, updatedRow)
                console.log(apiData);
            } catch (error) {
                console.error('Error updating QuestionBank :', error);
            }
        }

    };


    const onDeleteRow = async (id, oldRow, oldRows) => {
        try {
            //console.log(oldRow.questionBankId);
            const apiData = await deleteQuestionBank(oldRow.questionBankId);
            console.log(apiData);
        } catch (error) {
            console.error('Error deleting QuestionBank :', error);
        }
    };

    const columns = [
        // {
        //     field: 'questionBankId',
        //     headerName: 'ID',
        //     flex: 0.2,
        // },
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.2,
        },
        {
            field: 'questionBankText',
            headerName: 'Question Bank Text',
            flex: 1,
            editable: true
        },

    ];

    return (
        <Box
            sx={{
                marginTop:0,
                width: '90%',
                '& .textPrimary': {
                    color: 'text.primary',
                },
                // Added by Vanshita on 7-05-2024
                '& .MuiDataGrid-toolbarContainer': {
                    backgroundColor: colors.grey[500],
                    // backgroundColor:colors.blueAccent[600], 
                },
                "& .MuiDataGrid-cell": {
                    fontSize: 13,
                },
                "& .MuiDataGrid-virtualScroller": {
                    maxHeight: '200px',
                    width: 'inherit',
                    overflowY: 'auto !important',
                    overflowX: 'hidden !important',
                },
                "& .MuiDataGrid-columnHeaders": {
                    fontSize: 14,
                    backgroundColor: colors.grey[600],
                    // backgroundColor:colors.blueAccent[700], 
                    fontWeight: "bold"
                },
                "& .css-13qp4b7-MuiButtonBase-root-MuiButton-root":{    //Added on 03-06-2024
                    display:'none'
                }
               
                //Ended
            }}
        >
            <FullEditDataGrid
                columns={columns}
                rows={rows}
                
                // onSaveRow={onSaveRow}
                // onDeleteRow={onDeleteRow}
                // createRowData={createRowData}

                //Added by vanshita on 7-05-2024
                columnVisibilityModel={{
                    questionBankId: false,
                }}
                noActionColumn
            />
        </Box>
    );
}