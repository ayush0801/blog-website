# Blog App

This is a backend for a blog app that provides user authentication, blog management, and additional features. The backend is built using Node.js, Express.js, and MongoDB. It integrates with Twilio SendGrid for sending verification and confirmation emails using NodeMailer.

## Features

### User Authentication

- **Signup**: Users can register for an account, providing necessary details.
- **Login**: Secure JWT-based authentication for user login.
- **Account Verification**: Users receive verification emails to confirm their accounts.

### Blog Management

- **View Blogs**: Users can access all the blogs posted on the platform.
- **Search Blogs**: A search functionality to find blogs based on keywords or topics.
- **Create Blogs**: Authenticated users can create new blog posts.
- **Read Blogs**: Users can read individual blog posts in detail.
- **Update Blogs**: Authors can edit and update their existing blog posts.
- **Delete Blogs**: Authors have the ability to delete their blog posts.

### Additional Features

- **Email Integration**: Utilizes Twilio SendGrid via NodeMailer for sending verification and confirmation emails.
- **Comments (Future Feature)**: Plan to add functionality for users to comment on blog posts.
- **Forgot Password (Future Feature)**: Plan to implement a forgot password feature for account recovery.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Twilio SendGrid
- NodeMailer

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ayush0801/blog-website.git
   ```

2. **Set Environment Variables**:

Create a .env file in the root directory and set the following variables:
   ```
   SECRET_TOKEN=your_secret_jwt_token
   PORT = 3000
   SENDGRID_API_KEY=your_sendgrid_api_key
   DB_URL=your_mongodb_uri
   ```

3. **Run the Application:**
   ```
   npm start
   ```
