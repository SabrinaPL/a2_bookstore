import 'dotenv/config'

export const appConfig = {
  baseURL: process.env.BASE_URL || '/',
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === 'production'
}
