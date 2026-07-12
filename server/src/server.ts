import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 AssetFlow Server running on port ${PORT}`);
  console.log(`👉 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`👉 Profile: GET http://localhost:${PORT}/api/profile`);
  console.log(`=============================================`);
});
