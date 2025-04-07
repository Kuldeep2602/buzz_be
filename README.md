# 🚀 Buzz Backend

This is the **backend** service for the **Buzz** project — a content-sharing platform powered by Express, TypeScript, and MongoDB.

---

## 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB with Mongoose**
- **JWT for Authentication**
- **Elasticsearch** (planned)
- **Kafka** (planned)

---

## 📁 Project Structure

buzz-backend/ ├── src/ │ └── index.ts # Entry point ├── dist/ # Compiled JS (after build) ├── package.json ├── tsconfig.json └── README.md

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

Follow these steps to set up the backend locally:

### 1. Clone the repository

```bash
git clone https://github.com/Kuldeep2602/buzz.git
cd buzz


2. Initialize the project
bash
Copy
Edit
npm init -y


3. Setup TypeScript
bash
Copy
Edit
npm install -D typescript
npx tsc --init
In your tsconfig.json, update:

json
Copy
Edit
"outDir": "./dist",
"rootDir": "./src",


4. Install Core Dependencies
bash
Copy
Edit
npm install express mongoose jsonwebtoken


5. Install Type Definitions
bash
Copy
Edit
npm install -D @types/express @types/mongoose @types/jsonwebtoken
