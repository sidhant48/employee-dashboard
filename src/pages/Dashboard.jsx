import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Print, Add, Warning, Logout } from "@mui/icons-material";
import { initialEmployees } from "../utils/dummyData";
import EmployeeForm from "../components/EmployeeForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved && JSON.parse(saved).length > 0
      ? JSON.parse(saved)
      : initialEmployees;
  });

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleSaveEmployee = (data) => {
    if (currentEdit) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === data.id ? data : emp))
      );
      setSnackbar({
        open: true,
        message: "Record updated!",
        severity: "success",
      });
    } else {
      const newEmployee = { ...data, id: Date.now() };
      setEmployees((prev) => [...prev, newEmployee]);
      setSnackbar({
        open: true,
        message: "New employee added!",
        severity: "success",
      });
    }
    setIsFormOpen(false);
    setCurrentEdit(null);
  };

  const handleDeleteConfirm = () => {
    setEmployees(employees.filter((e) => e.id !== deleteTargetId));
    setDeleteTargetId(null);
    setSnackbar({
      open: true,
      message: "Record deleted successfully.",
      severity: "info",
    });
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesName = emp.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesGender = genderFilter === "All" || emp.gender === genderFilter;
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesName && matchesGender && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        className="no-print"
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight={800} color="primary">
          Employee Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <Paper
            variant="outlined"
            sx={{ p: 2, textAlign: "center", minWidth: 100 }}
          >
            <Typography variant="h5" fontWeight={700}>
              {employees.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Staff
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              textAlign: "center",
              minWidth: 100,
              borderLeft: "4px solid #2e7d32",
            }}
          >
            <Typography variant="h5" color="success.main" fontWeight={700}>
              {employees.filter((e) => e.status === "Active").length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active Now
            </Typography>
          </Paper>
          <Tooltip title="Sign Out">
            <Button
              variant="outlined"
              color="error"
              onClick={() => setIsLogoutModalOpen(true)}
              startIcon={<Logout />}
              sx={{ height: "fit-content", fontWeight: 600 }}
            >
              Logout
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      <Paper className="no-print" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Search Name"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            label="Gender"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="All">All </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setCurrentEdit(null);
              setIsFormOpen(true);
            }}
            sx={{ px: 4 }}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{ px: 4 }}
          >
            Print
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="no-print" align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>
                  <Avatar src={emp.image}>{emp.fullName[0]}</Avatar>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{emp.fullName}</TableCell>
                <TableCell>{emp.gender}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ width: 55 }}>
                      {emp.status}
                    </Typography>
                    <Switch
                      size="small"
                      checked={emp.status === "Active"}
                      color="success"
                      onChange={() =>
                        setEmployees(
                          employees.map((e) =>
                            e.id === emp.id
                              ? {
                                  ...e,
                                  status:
                                    e.status === "Active"
                                      ? "Inactive"
                                      : "Active",
                                }
                              : e
                          )
                        )
                      }
                    />
                  </Stack>
                </TableCell>
                <TableCell className="no-print" align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setCurrentEdit(emp);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteTargetId(emp.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="error" /> Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to remove this employee? This cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTargetId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <DialogTitle>Sign Out?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to log out of the Employee Management Panel?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsLogoutModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <EmployeeForm
        open={isFormOpen}
        handleClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
        editData={currentEdit}
      />
      <style>{`@media print { .no-print { display: none !important; } .MuiContainer-root { max-width: 100% !important; } }`}</style>
    </Container>
  );
}
