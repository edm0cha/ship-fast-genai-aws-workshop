# GenAI Flight App – Serverless Workshop Repo

Welcome to the **GenAI Flight App** workshop! In this hands-on session, you'll build and deploy a fully serverless application powered by AWS services and Generative AI.

---

## ✈️ What You'll Build
A simple flight booking web app where users can:
- Search for flights using a mock backend (AWS Lambda)
- “Purchase” tickets and generate a custom travel itinerary
- Adjust the "Adventurousness" level and number of passengers
- Deploy everything using CI/CD pipelines

---

## 🧱 Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Backend:** AWS Lambda (Node.js / TypeScript)
- **API Gateway** (REST)
- **Bedrock** (for itinerary generation)
- **CI/CD:** GitHub Actions
- **Infrastructure:** Terraform (S3, Lambda, API Gateway, IAM)

---

## 🗂️ Project Structure
```
genai-flight-app/
├── frontend/                  # React app (Vite)
├── backend/
│   ├── searchLambda/         # Handles flight search
│   └── itineraryLambda/      # Generates itineraries using Bedrock
├── infrastructure/           # Terraform for AWS resources
├── .github/workflows/        # CI/CD pipeline
└── README.md
```

---

## 🚀 Workshop Setup

### 1. Prerequisites
- AWS Account with programmatic access (IAM user or role)
- Node.js 18+, npm or pnpm
- Terraform CLI
- GitHub account (to fork/clone)

### 2. Clone This Repo
```bash
git clone https://github.com/your-org/genai-flight-app.git
cd genai-flight-app
```

### 3. Frontend: Local Dev
```bash
cd frontend
npm install
npm run dev
```

### 4. Deploy Infrastructure
```bash
cd infrastructure/terraform
terraform init
terraform apply
```

### 5. CI/CD Pipeline
- Triggered on `push` or `pull_request`
- Runs tests, lint, security scans
- Deploys Lambdas & S3 bucket

> You'll connect your AWS credentials using GitHub Actions secrets:
> `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

---

## 🧪 Testing
- `npm run lint` – ESLint
- `npm run test` – Unit tests for React components
- Backend Lambdas include sample test files

---

## 🧠 Workshop Goals
By the end of this session, you'll:
- Understand serverless architecture fundamentals
- Deploy a GenAI-powered app using Bedrock
- Automate your pipeline using GitHub Actions
- Leave with a real, working project in your AWS account!

---

## 🧵 Next Steps
Ready to get started? Head to the `frontend/` folder and begin with the search form component.
