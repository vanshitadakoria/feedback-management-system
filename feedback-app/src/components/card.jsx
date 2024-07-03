import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';                            
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import { getAllSubscriptionCategories } from '../services/superadmin';
import { useNavigate } from 'react-router-dom';

export default function OutlinedCard() {
    const [categories, setCategories] = React.useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getApiData = async () => {
            const response = await getAllSubscriptionCategories();
            setCategories(response);
        };

        getApiData();
    }, []);

    const handleClick = (subscriptionCategoryId) => {
        navigate(`/register/${subscriptionCategoryId}`);
        console.log(subscriptionCategoryId);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 2,
                backgroundColor: '#f0f0f0',  // Light background color
            }}
        >
            {/* Feedback System */}
            <Box sx={{ position: 'fixed', left: 0, top: 0, p: 2 }}>
                <Typography variant='h6' fontWeight='900'color='textPrimary'>Feedback System</Typography>
                {/* Add feedback system content here */}
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, ml: 5, maxWidth: '1200px' }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4,fontWeight:900 }}>
                    Select Your Plan
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {categories.map((category) => (
                        <Grid item key={category.subscriptionCategoryId} xs={12} sm={6} md={4} lg={3}>
                            <Card variant="outlined" sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%',
                                boxShadow: 3,
                                borderRadius: 2,
                                backgroundColor: '#ffffff',  // Card background color
                            }}>
                                <Typography variant='h5' sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    mt: 2, 
                                    fontWeight: 'bold', 
                                    color: '#e91e63',  // Changed title color to pink
                                }}>
                                    Subscription Plan
                                </Typography>
                                <CardContent sx={{ 
                                    flex: 1, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'center', 
                                    alignItems: 'center' 
                                }}>
                                    <Typography sx={{ 
                                        fontSize: 25, 
                                        fontWeight: 'bold', 
                                        color: '#333333',  // Text color
                                        mb: 2,
                                    }}>
                                        {category.subscriptionCategoryName}
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        color: '#666666',  // Subtext color
                                        mb: 1,
                                    }}>
                                        Max Customers: {category.maxCustomerUsers}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: '#666666',  // Subtext color
                                        mb: 1,
                                    }}>
                                        Max Responses: {category.maxResponses}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', mt: 'auto' }}>
                                    <Button size="small" variant="contained" sx={{bgcolor:'#e91e63'}} onClick={() => handleClick(category.subscriptionCategoryId)}>Buy Now</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}