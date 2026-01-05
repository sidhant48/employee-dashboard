import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Box,
  Avatar,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const EmployeeForm = ({ open, handleClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    state: "",
    status: "Active",
    image: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        fullName: "",
        gender: "",
        dob: "",
        state: "",
        status: "Active",
        image: "",
      });
    }
    setErrors({});
  }, [editData, open]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    let temp = {};
    if (!formData.fullName) temp.fullName = "Required";
    if (!formData.gender) temp.gender = "Required";
    if (!formData.dob) temp.dob = "Required";
    if (!formData.state) temp.state = "Required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={700}>
        {editData ? "Edit Staff Details" : "Add New Employee"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              src={formData.image}
              sx={{ width: 80, height: 80, border: "2px solid #1976d2" }}
            >
              {!formData.image && <PhotoCamera />}
            </Avatar>
            <Button variant="outlined" component="label" size="small">
              Upload Photo
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>
          </Box>

          <TextField
            label="Full Name"
            fullWidth
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Gender"
              fullWidth
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              error={!!errors.gender}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
            <TextField
              label="DOB"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              error={!!errors.dob}
            />
          </Stack>

          <TextField
            select
            label="State"
            fullWidth
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            error={!!errors.state}
          >
            <MenuItem value="NY">New York</MenuItem>
            <MenuItem value="CA">California</MenuItem>
            <MenuItem value="TX">Texas</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1">Initial Status</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === "Active"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? "Active" : "Inactive",
                    })
                  }
                  color="success"
                />
              }
              label={formData.status}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ px: 4 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
