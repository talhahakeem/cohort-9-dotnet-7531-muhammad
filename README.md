# Task Management System 🚀

A comprehensive, full-stack enterprise task management solution built with ASP.NET Core and React.js. This system features dynamic task tracking, robust admin controls, and seamless user management.

## 👨‍💻 Author
**Muhammad Talha Hakeem**
Full-Stack Developer (BS Computer Science)

## 🛠️ Tech Stack
* **Backend:** ASP.NET Core, C#, Entity Framework Core
* **Database:** SQL Server
* **Frontend:** React.js, Bootstrap/CSS
* **Architecture:** Clean Architecture & RESTful APIs
* **Quality Assurance:** SonarQube, xUnit

## ✨ Key Features
* **Authentication & Authorization:** Secure JWT-based login with Admin and Regular User roles.
* **Admin Dashboard:** Centralized user management, dynamic task details, and system statistics.
* **Task Management:** Complete CRUD operations, task categorization, and priority setting.
* **Robust Logging:** Integrated Serilog for tracking application events and global exception handling.

## 🧪 Code Quality
* **SonarQube Analysis:** The project has successfully passed the SonarQube Quality Gate locally, ensuring high standards of security, reliability, and maintainability.
* **Unit Testing:** Critical services and controllers are covered using xUnit.

## 🚀 How to Run Locally
1. Clone the repository.
2. Update the SQL Server connection string in `appsettings.json`.
3. Run `dotnet ef database update` to apply migrations.
4. Navigate to the `frontend` folder, run `npm install`, and then `npm run dev`.
5. Run the backend using `dotnet run`.