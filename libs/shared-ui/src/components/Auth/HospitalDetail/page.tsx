"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Hotel, MiscellaneousServices } from "@mui/icons-material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface FormState {
  beds: string;
  serviceLine: string[];
}

const HospitalDetailPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({ beds: "", serviceLine: [] });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const serviceLines = [
    "Ambulatory Surgical",
    "Emergency Department",
    "Inpatient Services",
    "Outpatient Services",
    "Specialty Care",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: keyof FormState, value: string[] | string) => {
    setForm({ ...form, [name]: value as string[] });
  };

  const handleBlur = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name === "beds" ? "Number of beds" : "Service line"} is required`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Partial<FormState> = {};
    if (!form.beds) newErrors.beds = "Number of beds is required";
    if (!form.serviceLine || form.serviceLine.length === 0)
      newErrors.serviceLine = "Service line selection is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Submitted:", form);
    }
  };

  const renderField = (
    name: keyof FormState,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    options?: string[]
  ) => {
    const hasValue = Array.isArray(form[name]) ? form[name].length > 0 : !!form[name];

    // Multi-select with chips for serviceLine
    if (name === "serviceLine") {
      return (
        <TextField
          select
          SelectProps={{
            multiple: true,
            value: form.serviceLine,
            onChange: (e) => handleSelectChange("serviceLine", e.target.value),
            input: <OutlinedInput />,
            renderValue: (selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() =>
                      setForm((prev) => ({
                        ...prev,
                        serviceLine: prev.serviceLine.filter((v) => v !== value),
                      }))
                    }
                    size="small"
                  />
                ))}
              </Box>
            ),
            displayEmpty: true,
            MenuProps: { disableScrollLock: true },
          }}
          name={name}
          label={label}
          fullWidth
          onBlur={() =>
            handleBlur({
              target: { name: "serviceLine", value: form.serviceLine },
            })
          }
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.95rem",
              color: "#9ca3af",
              "&.Mui-focused": { color: "#9ca3af" },
              transform: "translate(14px, 16px) scale(1)",
              "&.MuiInputLabel-shrink": {
                transform: "translate(14px, -8px) scale(0.85)",
                backgroundColor: "#fff",
                px: 0.5,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pr: 0.5 }}>
                {icon}
                <Box sx={{ height: 24, width: "1px", bgcolor: "#d1d5db", ml: 1 }} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          error={!!errors[name]}
          helperText={errors[name] || " "}
          FormHelperTextProps={{
            sx: { minHeight: "24px", marginLeft: 0 },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#fff",
              fontSize: "1rem",
              minHeight: "56px",
              "& fieldset": { borderColor: "#a8a8a8" },
              "&:hover fieldset": { borderColor: "#808080" },
              "&.Mui-focused fieldset": { borderColor: "#4285F4" },
            },
            "& .MuiOutlinedInput-input": { padding: "14px 10px" },
          }}
        >
          <MenuItem disabled value="">
            <span style={{ color: "#9ca3af" }}>{placeholder}</span>
          </MenuItem>
          {options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        name={name}
        value={form[name] as string}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={
          name === "beds"
            ? (e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }
            : undefined
        }
        onInput={
          name === "beds"
            ? (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }
            : undefined
        }
        label={label}
        placeholder={placeholder}
        fullWidth
        InputLabelProps={{
          shrink: true,
          sx: {
            fontSize: "0.95rem",
            color: "#9ca3af",
            "&.Mui-focused": { color: "#9ca3af" },
            transform: "translate(14px, 16px) scale(1)",
            "&.MuiInputLabel-shrink": {
              transform: "translate(14px, -8px) scale(0.85)",
              backgroundColor: "#fff",
              px: 0.5,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pr: 0.5 }}>
              {icon}
              <Box sx={{ height: 24, width: "1px", bgcolor: "#d1d5db", ml: 1 }} />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        error={!!errors[name]}
        helperText={errors[name] || " "}
        FormHelperTextProps={{
          sx: { minHeight: "24px", marginLeft: 0 },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fff",
            fontSize: "1rem",
            minHeight: "56px",
            "& fieldset": { borderColor: "#a8a8a8" },
            "&:hover fieldset": { borderColor: "#808080" },
            "&.Mui-focused fieldset": { borderColor: "#4285F4" },
          },
          "& .MuiOutlinedInput-input": { padding: "14px 10px" },
        }}
      />
    );
  };

  return (
    <Box
      className={`${inter.className}`}
      minHeight="100vh"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      overflow="hidden"
    >
      {/* Left Section */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        px={{ xs: 4, md: 16 }}
        py={6}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Image
            src="/medical-logo.png"
            alt="Company Logo"
            width={160}
            height={160}
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        {/* Form Section */}
        <Box
          maxWidth="sm"
          mx="auto"
          width="100%"
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box mb={4} textAlign="center">
            <Typography variant="h5" fontWeight={700} fontSize={24} color="#3D3D3D">
              Hospital Details
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={3}
            maxWidth={500}
            width="100%"
            mx="auto"
          >
            {renderField(
              "beds",
              "Number of Licensed Beds",
              "Enter number of beds",
              <Hotel fontSize="small" style={{ opacity: 0.7 }} />
            )}
            {renderField(
              "serviceLine",
              "What service lines exist at your Facility",
              "Select Service Lines",
              <MiscellaneousServices fontSize="small" style={{ opacity: 0.7 }} />,
              serviceLines
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#4285F4",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                py: 2,
                fontSize: "18px",
                "&:hover": { backgroundColor: "#3367D6" },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>

        {/* Bottom Text */}
        <Box mt={6} px={{ xs: 2, sm: 4, md: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              textAlign: "center",
              maxWidth: "90%",
              mx: "auto",
              lineHeight: 1.7,
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
            }}
          >
            Join our platform to securely manage your healthcare facility, collaborate with your
            team, and enhance patient care.
          </Typography>
        </Box>
      </Box>

      {/* Right Image */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: 1.1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "0 24px 24px 0",
          overflow: "hidden",
        }}
      >
        <Image
          src="/login_bg.svg"
          alt="Doctor"
          layout="intrinsic"
          width={700}
          height={800}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            borderRadius: "0 24px 24px 0",
          }}
          priority
        />
      </Box>
    </Box>
  );
};

export default HospitalDetailPage;
