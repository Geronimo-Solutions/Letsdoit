export const appConfig: {
  mode: "comingSoon" | "maintence" | "live"
} = {
  mode: "live",
}

export const protectedRoutes = ["/purchases", "/dashboard"]
export const applicationName = "Lets Do It"
export const companyName = "Geronimo"

export const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5
export const MAX_UPLOAD_IMAGE_SIZE = 1024 * 1024 * MAX_UPLOAD_IMAGE_SIZE_IN_MB

export const TOKEN_LENGTH = 32
export const TOKEN_TTL = 1000 * 60 * 5 // 5 min
export const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

export const MAX_PROJECT_LIMIT = 5
export const MAX_PROJECT_PREMIUM_LIMIT = 25

export const afterLoginUrl = "/dashboard"
