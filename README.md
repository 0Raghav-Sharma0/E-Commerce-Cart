### 1. Homepage & Promotions
![Screenshot 2025-05-17 134206](https://github.com/user-attachments/assets/1494713e-04cb-4766-8483-dcccac5b4289)
![Screenshot 2025-05-17 134220](https://github.com/user-attachments/assets/4336c322-59c2-4c39-80ca-949613eea04f)

### 2. User Authentication
![Screenshot 2025-05-17 135453](https://github.com/user-attachments/assets/56d56b3d-9c29-4203-9482-43e84d8f8c53)
![Screenshot 2025-05-17 134232](https://github.com/user-attachments/assets/ae4f624a-bf90-4fe4-ba02-b08ec6cb1e88)

### 3. Product Browsing
![Screenshot 2025-05-17 134339](https://github.com/user-attachments/assets/f7b369a8-2489-4d33-94bf-e183dc103b8d)
![Screenshot 2025-05-17 143154](https://github.com/user-attachments/assets/e13298ba-f676-4826-8200-967b673439dd)
![Screenshot 2025-05-17 134416](https://github.com/user-attachments/assets/22664dba-d390-477f-b6dd-a9ee51af1536)

### 4. Shopping Cart
![Screenshot 2025-05-17 134443](https://github.com/user-attachments/assets/61caac8d-fa1a-4e86-99de-75e08b660618)

### 5. Checkout Process
![Screenshot 2025-05-17 134651](https://github.com/user-attachments/assets/8f721bb1-c07a-49a3-9f49-96709e2b2bf4)
![Screenshot 2025-05-17 134706](https://github.com/user-attachments/assets/8b900eb7-96cb-4b86-af76-182210bd862d)

### 6. Database For Everything
![Screenshot 2025-05-17 134908](https://github.com/user-attachments/assets/f7d43dc1-1ca6-485f-acf2-ef92e83f6637)

## 🚀 Complete Setup & Installation

1. **Clone and install everything with one command block:**
```bash
git clone https://github.com/0Raghav-Sharma0/MERN-Stack-Ecommerce-App.git && \
cd MERN-Stack-Ecommerce-App && \
cd backend && npm install && \
cd .. && npm install && \
echo "PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here" > backend/.env
```
2. Run both frontend and backend with one command (in separate terminals):

# Terminal 1 - Backend:
```bash
cd MERN-Stack-Ecommerce-App/backend && node index.js
```
# Terminal 2 - Frontend:
```bash
cd MERN-Stack-Ecommerce-App && npm run dev
```

# 🌟 All Features in One Place
User System: JWT Auth, Protected Routes, Password Hashing

Shopping: Product Catalog, Smart Cart, Checkout, Order History

Admin: Product/User/Order Management

Tech: React 18, Material UI, Node.js, Express, MongoDB

# 📂 Complete Project Structure
```bash
MERN-Stack-Ecommerce-App/
├── backend/ (Node.js/Express)
│   ├── config/       ├── controllers/   
│   ├── middleware/   ├── models/        
│   ├── routes/       ├── seed/         
├── src/ (React)
│   ├── components/   ├── context/      
│   ├── pages/        ├── App.js        
├── package.json
```

# 🔌 All API Endpoints
Auth: /api/auth/[register|login|me]

Products: /api/products (CRUD)

Orders: /api/orders (Create/Read)

# ⚙️ Environment Variables
PORT=5000

MONGO_URI=your_connection_string

JWT_SECRET=your_secret_key

# 🚀 Production Deployment
```bash 
# Backend:
NODE_ENV=production pm2 start index.js

# Frontend:
npm run build && deploy build/ folder
```
# 📜 License: MIT
👨💻 Author: Raghav Sharma
📧 Contact: example@email.com
🔗 GitHub: 0Raghav-Sharma0

