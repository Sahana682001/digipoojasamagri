const JWT = {
  jwt: process.env.JWT_SECRET || '12345-67890-09876-54323',
  jwtExp: '100d',
}
module.exports = {JWT}
