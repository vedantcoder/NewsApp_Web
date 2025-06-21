# 📰 NewsApp_Web

A full-stack **backend-focused** news application built using **Node.js**, **Express.js**, **PostgreSQL**, and **Mustache**. 
This project was developed as part of a backend web development course, with an emphasis on server-side logic and database integration.

> **Note**: As a backend-oriented project, the frontend is intentionally kept **minimal and basic**, styled with Bootstrap to showcase backend functionality rather than advanced UI design.

---

## Live Demo

Access the deployed application here:  
🔗 https://newsapp-web.onrender.com/

---

## Features

- View all news articles
- Create your profile
- Log into yuor profile 
- Add new articles (title + content)
- Edit articles
- Delete articles  
- Responsive UI using Bootstrap  
- Server-side rendering with Mustache  
- PostgreSQL database integration via `pg-promise`

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (pg-promise)
- **Templating Engine**: Mustache  
- **Frontend**: HTML, CSS, Bootstrap 
- **Hosting**: Render

---

## Project Structure

NewsApp_Web/  
├── app.js               → App entry point  
├── routes/              → Express route handlers  
├── views/               → Mustache templates  
│   └── partials/        → Header, navbar, etc.  
├── public/              → Static assets  
│   └── css/             → Custom stylesheets  
├── utils/               → Utility modules  
├── .gitignore           → Git ignored files  
├── Procfile             → For deployment on Render  
├── NewsApp.txt          → Project notes 
├── package.json         → Dependencies and metadata  
├── package-lock.json    → Dependency lock file  
└── README.md            → Project documentation

---

## Environment Variables

To connect to your PostgreSQL database, set the following environment variable:

`DATABASE_URL=postgres://<username>:<password>@localhost:5432/newsdb`

In Render, this is already configured via the dashboard.

---

## Local Development

To run the project locally:

1. Clone the repository  
2. Install dependencies: `npm install`  
3. Set up PostgreSQL and create the required tables  
4. Create a `.env` file with your `DATABASE_URL`  
5. Start the server: `node app.js` or `nodemon app.js`  
6. Visit `http://localhost:3000` in your browser

---
