import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Input,
  Select,
  Option,
  Button,
  Stack,
  Checkbox,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/joy";

export default function User() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "user",
    status: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = ({ name, value }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (formData.status.length === 0) {
      newErrors.status = "Select at least one access option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await new Promise((r) => setTimeout(r, 1000));
      setMessage({ type: "success", text: "User created successfully!" });
      setFormData({
        email: "",
        fullName: "",
        role: "user",
        status: [],
      });
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.message || "Failed to create user",
      });
    } finally {
      setLoading(false);
    }
  };


  const accessOptions = [
    "All access",
    "History",
    "User",
    "Gateway",
    "Alarm",
    "Setting",
  ];

  return (
    <Card
      variant="outlined"
      sx={{
    
        mx: "auto",
      
        p: 2,
        borderRadius: "lg",
        boxShadow: "sm",
        bgcolor: "background.body",
      }}
    >
      <CardContent>
        <Typography level="h4" fontWeight="lg" mb={1}>
          Create New User
        </Typography>
        <Typography level="body2" mb={2} textColor="text.tertiary">
          Add a new user to the system with appropriate permissions.
        </Typography>

        {message.text && (
          <Alert
            color={message.type === "success" ? "success" : "danger"}
            variant="soft"
            sx={{ mb: 2 }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl required error={!!errors.email}>
              <FormLabel>Email Address</FormLabel>
              <Input
                fullWidth
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  handleChange({ name: "email", value: e.target.value })
                }
                placeholder="user@example.com"
              />
              {errors.email && (
                <Typography level="body3" color="danger">
                  {errors.email}
                </Typography>
              )}
            </FormControl>

            <FormControl required error={!!errors.fullName}>
              <FormLabel>Full Name</FormLabel>
              <Input
                fullWidth
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  handleChange({ name: "fullName", value: e.target.value })
                }
                placeholder="John Doe"
              />
              {errors.fullName && (
                <Typography level="body3" color="danger">
                  {errors.fullName}
                </Typography>
              )}
            </FormControl>

            <FormControl required>
              <FormLabel>Role</FormLabel>
              <Select
                fullWidth
                name="role"
                value={formData.role}
                onChange={(event, newValue) =>
                  handleChange({ name: "role", value: newValue })
                }
              >
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="viewer">Viewer</Option>
              </Select>
            </FormControl>

            <FormControl error={!!errors.status}>
              <FormLabel>Access</FormLabel>
              <Stack direction="row" spacing={1} flexWrap="wrap" marginTop={2}>
                {accessOptions.map((status) => (
                  <Checkbox
                    key={status}
                    label={status}
                    checked={formData.status.includes(status)}
                    onChange={(e) => {
                      const newStatus = e.target.checked
                        ? [...formData.status, status]
                        : formData.status.filter((s) => s !== status);
                      handleChange({ name: "status", value: newStatus });
                    }}
                    variant="soft"
                    color="primary"
                  />
                ))}
              </Stack>
              {errors.status && (
                <Typography level="body3" color="danger">
                  {errors.status}
                </Typography>
              )}
            </FormControl>
          </Stack>

          <CardActions
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
        
            <Button
              fullWidth
              type="submit"
              variant="solid"
              color="primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
}
