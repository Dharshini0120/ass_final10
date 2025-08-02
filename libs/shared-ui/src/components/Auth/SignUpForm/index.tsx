import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  InputAdornment,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Person, Email, Phone, Business, LocationCity, Public, Badge } from '@mui/icons-material';
import { SignUpFormData, UserType } from '../../../../../shared-types/src/auth/auth.types';

interface SignUpFormProps {
  userType: UserType;
  onSubmit: (data: SignUpFormData) => void;
  loading?: boolean;
}

export const SignUpForm = ({ userType, onSubmit, loading = false }: SignUpFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    facilityName: '',
    facilityType: '',
    state: '',
    county: '',
    role: userType === 'admin' ? 'Admin' : 'User'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const facilityTypes = [
    'Academic Hospital',
    'General Hospital',
    'Specialty Clinic',
    'Private Practice',
    'Community Health Center'
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const counties = {
    'Texas': ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    // Add more as needed
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 800 }}>
      <Grid container spacing={2}>
        {/* Name Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="firstName"
            label="Full Name"
            value={formData.firstName}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Phone Number */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Facility Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="facilityName"
            label="Facility Name"
            value={formData.facilityName}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Facility Type */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="facilityType"
            label="Facility Type"
            value={formData.facilityType}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCity color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {facilityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="state"
            label="State"
            value={formData.state}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Public color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* County */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="county"
            label="County"
            value={formData.county}
            onChange={handleChange}
            disabled={!formData.state}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCity color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {formData.state && counties[formData.state as keyof typeof counties]?.map((county) => (
              <MenuItem key={county} value={county}>
                {county}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Role */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge color="primary" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{
            width: isMobile ? '100%' : 300,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Processing...' : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
};