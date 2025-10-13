import { useState } from "react";
import {
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
import { add_emp } from "../utils/helper";

export default function User() {
  const [formData, setFormData] = useState({
    emp_email_id: "",
    emp_name: "",
    position: "user",
    store_id: "100",
    access: [],
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
    if (!formData.emp_email_id) {
      newErrors.emp_email_id = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emp_email_id)) {
      newErrors.emp_email_id = "Enter a valid email address";
    }

    if (!formData.emp_name.trim()) {
      newErrors.emp_name = "Full name is required";
    }

    if (formData.access.length === 0) {
      newErrors.access = "Select at least one access option";
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
      const res = await add_emp(formData);

      if (!res?.data?.status) {
        setMessage({
          type: "danger",
          text: "Failed to create user",
        });
      } else {
        setMessage({
          type: "success",
          text: "User created successfully!",
        });
        setFormData({
          emp_email_id: "",
          emp_name: "",
          position: "user",
          store_id: "100",
          access: [],
        });
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.message || "Failed to create user",
      });
    } finally {
      setLoading(false);
      // Automatically hide message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
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
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white p-5">
      <CardContent>
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
            {/* Email */}
            <FormControl required error={!!errors.emp_email_id}>
              <FormLabel>Email Address</FormLabel>
              <Input
                fullWidth
                type="email"
                name="emp_email_id"
                value={formData.emp_email_id}
                onChange={(e) =>
                  handleChange({ name: "emp_email_id", value: e.target.value })
                }
                placeholder="Enter email id"
              />
              {errors.emp_email_id && (
                <Typography level="body3" color="danger">
                  {errors.emp_email_id}
                </Typography>
              )}
            </FormControl>

            {/* Full Name */}
            <FormControl required error={!!errors.emp_name}>
              <FormLabel>Full Name</FormLabel>
              <Input
                fullWidth
                type="text"
                name="emp_name"
                value={formData.emp_name}
                onChange={(e) =>
                  handleChange({ name: "emp_name", value: e.target.value })
                }
                placeholder="Enter full name"
              />
              {errors.emp_name && (
                <Typography level="body3" color="danger">
                  {errors.emp_name}
                </Typography>
              )}
            </FormControl>

            {/* Role */}
            <FormControl required>
              <FormLabel>Role</FormLabel>
              <Select
                fullWidth
                name="position"
                value={formData.position}
                onChange={(_, newValue) =>
                  handleChange({ name: "position", value: newValue })
                }
              >
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="viewer">Viewer</Option>
              </Select>
            </FormControl>

            {/* Access */}
            <Stack spacing={1}>
              <FormLabel>Access</FormLabel>
              <Stack direction="row" spacing={1} flexWrap="wrap" marginTop={2}>
                {accessOptions.map((access) => (
                  <Checkbox
                    key={access}
                    label={access}
                    checked={formData.access.includes(access)}
                    onChange={(e) => {
                      const newStatus = e.target.checked
                        ? [...formData.access, access]
                        : formData.access.filter((s) => s !== access);
                      handleChange({ name: "access", value: newStatus });
                    }}
                    variant="soft"
                    color="primary"
                  />
                ))}
              </Stack>
              {errors.access && (
                <Typography level="body3" color="danger">
                  {errors.access}
                </Typography>
              )}
            </Stack>
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
              sx={{ backgroundColor: "#21409a" }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </div>
  );
}
