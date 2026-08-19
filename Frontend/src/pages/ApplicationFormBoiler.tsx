//As per boiler application form
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ApplicationForm.css";
import { useNavigate } from "react-router-dom";

interface BoilerApplicationFormProps {
    applicationId?: string;
}

function BoilerApplicationForm({ applicationId }: BoilerApplicationFormProps) {
const [formData,setFormData] = useState<any>({

    applicant_name:"",
    mobile_number:"",
    address:"",
    boiler_type:"",
    boiler_capacity:"",
    year_of_installation:"",
    purpose:""

});

const navigate = useNavigate();
const [files,setFiles]=useState<any>({});

const [existingCertificate, setExistingCertificate] =
    useState<string>("");

const handleChange=(e:any)=>{

    setFormData({

        ...formData,

        [e.target.name]:e.target.value

    });

};





useEffect(() => {

    if (!applicationId) {
        return;
    }
    
    const loadDraft = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/applications/boiler/edit/${applicationId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "FULL API RESPONSE:",
                response.data
            );

            // =========================================
            // IMPORTANT
            // Data is inside response.data.application
            // =========================================

            const application =
                response.data.application;

            console.log(
                "APPLICATION DATA:",
                application
            );

            console.log(
                "Applicant:",
                application.applicant_name
            );

            console.log(
                "Mobile:",
                application.mobile_number
            );

            console.log(
                "Address:",
                application.address
            );

            console.log(
                "Boiler Type:",
                application.boiler_type
            );

            console.log(
                "Boiler Capacity:",
                application.boiler_capacity
            );

            console.log(
                "Year:",
                application.year_of_installation
            );

            console.log(
                "Purpose:",
                application.purpose
            );


            setFormData({

                applicant_name:
                    application.applicant_name ?? "",

                mobile_number:
                    application.mobile_number ?? "",

                address:
                    application.address ?? "",

                boiler_type:
                    application.boiler_type ?? "",

                boiler_capacity:
                    application.boiler_capacity ?? "",

                year_of_installation:
                    application.year_of_installation ?? "",

                purpose:
                    application.purpose ?? ""

            });
setExistingCertificate(
    application.boiler_certificate ?? ""
);
        }
        catch (error: any) {

            console.log(
                "Error loading boiler draft:",
                error.response?.data ||
                error.message
            );

        }

    };

    loadDraft();

}, [applicationId]);


const handleFile=(e:any)=>{

    setFiles({

        ...files,

        [e.target.name]:e.target.files[0]

    });

};


const saveDraft = async () => {

    const data = new FormData();

    Object.keys(formData).forEach(key => {

        data.append(
            key,
            formData[key]
        );

    });


    if (applicationId) {

        data.append(
            "application_id",
            applicationId
        );

    }


    if (files.boiler_certificate) {

        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );

    }


    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/applications/boiler/draft",
            data,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        console.log(
            "Save Draft Response:",
            response.data
        );

        alert(response.data.message);

    }
    catch (error: any) {

        console.log(
            "Save Draft Error:",
            error.response?.data ||
            error.message
        );

        alert("Draft save failed");

    }

};



const submitForm = async (e: any) => {

    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach(key => {

        data.append(
            key,
            formData[key]
        );

    });


    // Existing draft/application
    if (applicationId) {

        data.append(
            "application_id",
            applicationId
        );

    }


    if (files.boiler_certificate) {

        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );

    }


    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/applications/boiler",
            data,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        console.log(
            "Submit Response:",
            response.data
        );

        alert(
            response.data.message
        );
        navigate("/dashboard");
    }
    catch (error: any) {

        console.log(
            "Submit Error:",
            error.response?.data ||
            error.message
        );

        alert(
            "Submission failed"
        );

    }

};






return (
    <Box
        sx={{
            maxWidth: 900,
            mx: "auto",
            p: 3,
        }}
    >
        <Card elevation={2}>

            <CardHeader
                title="Boiler Inspection Application"
            />

            <CardContent>

                <Box
                    component="form"
                    onSubmit={submitForm}
                >

                    <Stack spacing={3}>

                        {/* Applicant Name */}
                        <TextField
                            label="Applicant Name"
                            name="applicant_name"
                            value={formData.applicant_name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        {/* Mobile Number */}
                        <TextField
                            label="Mobile Number"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            inputProps={{
                                maxLength: 10,
                            }}
                            fullWidth
                            required
                        />

                        {/* Address */}
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                            required
                        />

                        {/* Boiler Type */}
                        <FormControl fullWidth required>

                            <InputLabel>
                                Boiler Type
                            </InputLabel>

                            <Select
                                name="boiler_type"
                                value={formData.boiler_type}
                                label="Boiler Type"
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    Select
                                </MenuItem>

                                <MenuItem value="Steam Boiler">
                                    Steam Boiler
                                </MenuItem>

                                <MenuItem value="Hot Water Boiler">
                                    Hot Water Boiler
                                </MenuItem>

                                <MenuItem value="Industrial Boiler">
                                    Industrial Boiler
                                </MenuItem>

                            </Select>

                        </FormControl>

                        {/* Boiler Capacity */}
                        <TextField
                            label="Boiler Capacity (TPH)"
                            type="number"
                            name="boiler_capacity"
                            value={formData.boiler_capacity}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        {/* Year of Installation */}
                        <TextField
                            label="Year of Installation"
                            type="number"
                            name="year_of_installation"
                            value={formData.year_of_installation}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        {/* Purpose */}
                        <TextField
                            label="Purpose"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                            required
                        />

                        {/* Boiler Certificate */}
                        <Box>

                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                gutterBottom
                            >
                                Upload Boiler Certificate
                            </Typography>

                            {/* Existing Certificate */}
                            {existingCertificate && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 2,
                                        mb: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        backgroundColor: "background.default",
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            flexGrow: 1,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {existingCertificate}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="a"
                                        href={`http://localhost:5000/uploads/${existingCertificate}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Certificate
                                    </Button>

                                </Box>
                            )}

                            {/* File Upload */}
                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Choose Certificate

                                <input
                                    type="file"
                                    name="boiler_certificate"
                                    hidden
                                    onChange={handleFile}
                                />
                            </Button>

                        </Box>

                        {/* Buttons */}
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            justifyContent="flex-end"
                        >

                            <Button
                                type="button"
                                variant="outlined"
                                onClick={saveDraft}
                            >
                                Save Draft
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Submit Application
                            </Button>

                        </Stack>

                    </Stack>

                </Box>

            </CardContent>

        </Card>
    </Box>
)

export default BoilerApplicationForm;