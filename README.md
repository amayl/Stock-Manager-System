# 📦 Stock Management System – A Level Computer Science NEA

This repository contains the source code for my **OCR A Level Computer Science NEA Project (2023–2025)**.  
My project is a **Stock Management System** designed for **Nithush Foods**, a local supermarket, to replace their manual paper-based method of managing stock.

📄 Full written report (NEA documentation):  
[View Report on Google Docs](https://docs.google.com/document/d/1mwzLWyiwAMgBnw9Aq8avnjKRL7aphR7WJLa0Er13ATA/edit?usp=sharing)

View the deployed app: https://ntshfoods.com
---

## 🎯 Project Aims

- Automate stock management for a small supermarket.
- Reduce human error from manual stock calculations.
- Provide **real-time updates**, **low stock alerts**, and **statistical insights**.
- Include different levels of user access: **owner, manager, customer**.

---

## 🚀 Features

- 🔑 Login and sign-up system with password hashing.  
- 👥 Role-based access (owners, managers, customers).  
- 📊 Statistical dashboard (stock value, category breakdown, alerts).  
- ✏️ Add, edit, and delete products in real-time.  
- 🔎 Search for specific products.  
- ⚠️ Automatic low-stock alerts.  
- 🎨 User-friendly web interface.  

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Security:** bcrypt password hashing  
- **Testing:** Manual API tests + Jest  

---

## ⚙️ Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/stock-management-system.git
   cd stock-management-system
   ```
Install dependencies:

```bash
npm install
Run MongoDB locally or connect to MongoDB Atlas.
Update server.js with your connection string:
```
```javascript
mongoose.connect('mongodb://localhost:27017/stockDB');
```

Start the development server:

```bash
node server/server.js
```
Open browser at:
http://localhost:4000

🧪 Testing
```bash
npm test
```
Includes tests for sign-up, login, product CRUD, and stock alerts.

Manual test cases documented in the NEA report.

🔮 Future Improvements
🌐 Cloud deployment (Heroku/Vercel + MongoDB Atlas).

📱 Responsive design for mobile devices.

🏷️ Barcode scanning integration.

📑 Automated PDF/CSV report generation.

🔒 Enhanced authentication (JWT, 2FA, session management).

🧾 User activity logs for auditing stock edits and deletions.

