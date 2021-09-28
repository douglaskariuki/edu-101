const config = {
    env: 'development',
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET || "secret_key",
    mongoUri: process.env.MONGODB_URI
}

export default config;