import { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "dashboard") {
      localStorage.setItem("isAdmin", "true");
      navigate("/dashboard");
    } else {
      setErrorOpen(true);
    }
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setErrorOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: "100%", borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            color="primary"
          >
            Employee Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Enter password <strong>dashboard</strong> to access the dashboard
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            error={errorOpen}
          />
          <Button
            size="large"
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ py: 1.5 }}
          >
            Login
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%", fontWeight: 600 }}
        >
          Invalid password! Please use 'dashboard'.
        </Alert>
      </Snackbar>
    </Container>
  );
}
