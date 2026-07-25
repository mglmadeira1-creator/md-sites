export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  isLight: boolean;
}

export const themes: Record<string, ThemeConfig> = {
  apple: {
    primary: "#1d1d1f",
    secondary: "#f5f5f7",
    accent: "#0066cc",
    background: "#ffffff",
    surface: "#f5f5f7",
    border: "rgba(0, 0, 0, 0.08)",
    textPrimary: "#1d1d1f",
    textSecondary: "#86868b",
    isLight: true
  },
  tesla: {
    primary: "#e82127",
    secondary: "#171a20",
    accent: "#3d3d3d",
    background: "#090909",
    surface: "#181b21",
    border: "rgba(255, 255, 255, 0.08)",
    textPrimary: "#ffffff",
    textSecondary: "#a2a3a5",
    isLight: false
  },
  ferrari: {
    primary: "#ff2800",
    secondary: "#000000",
    accent: "#fff200",
    background: "#0a0a0a",
    surface: "#151515",
    border: "rgba(255, 40, 0, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "#cccccc",
    isLight: false
  },
  stripe: {
    primary: "#635bff",
    secondary: "#0a2540",
    accent: "#00d4ff",
    background: "#0f172a",
    surface: "#1e293b",
    border: "rgba(99, 91, 255, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "#adbdcc",
    isLight: false
  },
  spotify: {
    primary: "#1db954",
    secondary: "#191414",
    accent: "#1ed760",
    background: "#121212",
    surface: "#181818",
    border: "rgba(29, 185, 84, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "#b3b3b3",
    isLight: false
  },
  netflix: {
    primary: "#e50914",
    secondary: "#000000",
    accent: "#b30710",
    background: "#000000",
    surface: "#141414",
    border: "rgba(229, 9, 20, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "#aaaaaa",
    isLight: false
  },
  corporate: {
    primary: "#0f172a",
    secondary: "#f8fafc",
    accent: "#2563eb",
    background: "#ffffff",
    surface: "#f1f5f9",
    border: "rgba(15, 23, 42, 0.08)",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    isLight: true
  },
  luxury: {
    primary: "#d4af37",
    secondary: "#0a0f1d",
    accent: "#c5a059",
    background: "#0a0f1d",
    surface: "#111827",
    border: "rgba(212, 175, 55, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "#9ca3af",
    isLight: false
  },
  medical: {
    primary: "#0284c7",
    secondary: "#f0f9ff",
    accent: "#0ea5e9",
    background: "#ffffff",
    surface: "#e0f2fe",
    border: "rgba(2, 132, 199, 0.08)",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    isLight: true
  },
  restaurant: {
    primary: "#ea580c",
    secondary: "#fdf8f6",
    accent: "#ca8a04",
    background: "#ffffff",
    surface: "#ffedd5",
    border: "rgba(234, 88, 12, 0.08)",
    textPrimary: "#1e293b",
    textSecondary: "#475569",
    isLight: true
  },
  nature: {
    primary: "#15803d",
    secondary: "#f0fdf4",
    accent: "#16a34a",
    background: "#ffffff",
    surface: "#dcfce7",
    border: "rgba(21, 128, 61, 0.08)",
    textPrimary: "#14532d",
    textSecondary: "#3f6212",
    isLight: true
  },
  dark: {
    primary: "#3b82f6",
    secondary: "#0f172a",
    accent: "#60a5fa",
    background: "#030712",
    surface: "#1e293b",
    border: "rgba(255, 255, 255, 0.05)",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    isLight: false
  },
  minimal: {
    primary: "#000000",
    secondary: "#ffffff",
    accent: "#737373",
    background: "#ffffff",
    surface: "#fafafa",
    border: "#e5e5e5",
    textPrimary: "#171717",
    textSecondary: "#737373",
    isLight: true
  },
  glass: {
    primary: "#38bdf8",
    secondary: "rgba(15, 23, 42, 0.3)",
    accent: "#0ea5e9",
    background: "#030712",
    surface: "rgba(30, 41, 59, 0.5)",
    border: "rgba(255, 255, 255, 0.08)",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    isLight: false
  },
  startup: {
    primary: "#4f46e5",
    secondary: "#f5f3ff",
    accent: "#818cf8",
    background: "#ffffff",
    surface: "#ede9fe",
    border: "rgba(79, 70, 229, 0.08)",
    textPrimary: "#1e1b4b",
    textSecondary: "#4c1d95",
    isLight: true
  },
  agency: {
    primary: "#ec4899",
    secondary: "#fff1f2",
    accent: "#f43f5e",
    background: "#ffffff",
    surface: "#ffe4e6",
    border: "rgba(236, 72, 153, 0.08)",
    textPrimary: "#4c0519",
    textSecondary: "#881337",
    isLight: true
  }
};
