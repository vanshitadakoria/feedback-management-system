import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginCustomerUser } from '../../services/customeruser'; // Import your login service
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { useAuth } from './AuthContext';
import Image from '../../images/bg1.jpg';
import { getCustomerAdminById } from '../../services/customeradmin';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        FEEDBACK SYSTEM
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn({ handleLogin }) {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customerTokenId = data.get('customerTokenId');
    const password = data.get('password');


    try {
      const response = await loginCustomerUser(customerTokenId, password);
      console.log("api resp:", response);
      const token = response.token;
      if(response.user.status == 'inactive'){
        const decodedToken = jwtDecode(token);

        if(decodedToken.role == 'CustomerAdmin'){
          alert("Your Account has been deactivated. \nContact Administrator : admin@gmail.com");
        }

        if(decodedToken.role == 'CustomerUser'){
          const CustomerAdminDetail = await getCustomerAdminById(response.user.customerAdminId);
          alert(`Your Account has been deactivated. \nContact Administrator : ${CustomerAdminDetail.officialEmailId}`);
        }
        
      } else {
        if (token) {
          login(token);
          handleLogin(token);
          sessionStorage.setItem('user', JSON.stringify(response.user));
  
        }
      }
      
      


      // localStorage.setItem('token', token);

      // // Decode the token to extract user roles
      // const decodedToken = jwtDecode(token);
      // const roles = decodedToken.role;
      // console.log("roles:",roles);

      // localStorage.setItem('roles', JSON.stringify(roles));

      // Check user role and navigate accordingly
      // if (roles.includes("CustomerAdmin")) {
      //   handleLogin("CustomerAdmin");
      //   const customerAdminId = response.user.customerAdminId;
      //   console.log("CustomerAdmin ID", customerAdminId);
      //   alert("CustomerAdmin Login Successfully");
      //   navigate('/customeradmin/dashboard', { state: { customerAdminId } });
      // } else if (roles.includes("CustomerUser")) {
      //   handleLogin("CustomerUser");
      //   const customerUserId = response.user.customerUserId;
      //   console.log("CustomerUser ID", customerUserId);
      //   alert("CustomerUser Login Successfully");
      //   navigate('/customeruser/dashboard', { state: { customerUserId } });
      // } else {
      //   console.log("Invalid role");
      // }
    } catch (error) {
      console.error('Error logging in:', error);

      if (error.response) {
        if (error.response.status === 404) {
          alert("API endpoint not found. Please check the URL.");
        } else if (error.response.status === 401) {
          alert("Invalid customerTokenId & password.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* <Container component="main" maxWidth="xs"> */}
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url(${Image})`,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundSize: 'cover',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light overlay
          },
        }}
      >
        <Box
          sx={{
            p:5,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 600,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#E5E4E2',
            zIndex: 1
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
         
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="customerTokenId"
              label="Token Id"
              name="customerTokenId"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href='/register' variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 2, }} />
        </Box>


      </Box>

      {/* </Container> */}
    </ThemeProvider>
  );
}
