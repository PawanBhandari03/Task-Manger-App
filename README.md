Task Manager App

This is a full-stack Task Manager application built using Spring Boot (Java) for the backend and React (Vite) for the frontend. The application allows users to create task lists, add tasks, update them, mark tasks as completed, and track progress.

Tech Stack:
Backend: Spring Boot (Java)
Frontend: React (Vite, NextUI)
Database: PostgreSQL

Features:

- Create, update, and delete task lists
- Add, update, and delete tasks
- Mark tasks as completed or open
- Track progress using a progress bar

Project Structure:
Backend/ → Spring Boot API
Frontend/ → React UI

Prerequisites:

- Java 17 or above
- Node.js (v16 or above)
- npm
- PostgreSQL

How to Run:

1. Clone the repository

git clone https://github.com/PawanBhandari03/Task-Manager-App.git

2. Run Backend

cd Backend
./mvnw spring-boot:run

Backend runs on: http://localhost:8080

3. Run Frontend (open new terminal)

cd Frontend
npm install
npm run dev

Frontend runs on: http://localhost:5173

API Base URL:
http://localhost:8080

Notes:

- Backend must be running before frontend
- Make sure database is configured properly
- If ports are busy, change them
- Database Setup:

Make sure PostgreSQL is running.

Update database configuration in:
Backend/src/main/resources/application.properties

Example:
spring.datasource.url=jdbc:postgresql://localhost:5432/taskdb
spring.datasource.username=your_username
spring.datasource.password=your_password

Author:
Pawan Bhandari
