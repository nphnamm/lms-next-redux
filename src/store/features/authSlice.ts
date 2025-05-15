import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/lib/services/authService';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

interface MeResponse {
  succeeded: boolean;
  message: string | null;
  code: string | null;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
  };
  errors: any | null;
  request: any | null;
  returnUrl: string | null;
}

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(otp);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const getMe = createAsyncThunk<MeResponse, void>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      console.log("response",response.data);
      return response.data as any;

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data?.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data?.user;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.data?.user; 
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string | null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 