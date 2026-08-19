import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#455a64",
        },
        background: {
            default: "#f5f7fa",
        },
    },

    typography: {
        fontFamily: "Inter, Roboto, Arial, sans-serif",

        h4: {
            fontWeight: 600,
        },

        h5: {
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        },

        MuiTextField: {
            defaultProps: {
                size: "small",
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;