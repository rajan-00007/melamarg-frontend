export const colors = {
    /* Brand Design Theme (Orange/Slate/Teal) */
    brand: {
        primary: "#E65100",    // Warm Orange / Rust
        secondary: "#455A64",  // Cool Slate Blue-grey
        tertiary: "#00695C",   // Deep Teal
        neutral: "#F5F5F5",    // Soft warm off-white / light grey
    },

    /* Primary (Blue theme) */
    primary: {
        1: "#0052F7",
        2: "#001540",
    },

    /* Reco Card */
    reco: {
        100: "#FFFFFF",
        300: "#85ADFA",
        400: "#437DF1",
        500: "#0042C6",
        600: "#3375F9",
        600_2: "#1852E5",
    },

    /* Blue */
    blue: {
        100: "#F1FAFE",
        100_2: "#CFE7FF",
        200: "#E6EEFE",
        300: "#003AAF",
        400: "#0340D1"
    },

    /* Green */
    green: {
        100: "#F0FDF4",
        200: "#16A34A",
        200_2: "#8AC49E",
        300: "#15803D",
    },

    /* Yellow */
    yellow: {
        100: "#FCF2E7",
        200: "#FDC700",
        300: "#9A7B1B",
    },

    /* Neutral */
    neutral: {
        100: "#F9FAFC",
        400: "#B0C6F3",
        500: "#E5EAF0",
        500_2: "#EEF2F6",
        600: "#DBE6FC",
        700_2: "#B5B7BD",
        700: "#91949D",
        800: "#475569",
        900: "#0F172A",
    },

    /* Base (Black / White) */
    base: {
        black: "#000000",
        white: "#FFFFFF",
    },
} as const;

export type ThemeColors = typeof colors;
