# GitHub Repos Project

This project is a full-stack application for retrieving and displaying a list of GitHub repositories and their details using a Personal Access Token (PAT).

## Features

- Fetch repositories from GitHub using REST API.
- Robust and scalable backend built with Node.js, Apollo Server, and Bull for task queue management.
- Fully typed with TypeScript for reliability and maintainability.

## Technologies Used

### Backend:

- **Node.js**: Runtime environment for the server.
- **Apollo Server**: For building a GraphQL API.
- **GraphQL**: Query language for fetching data.
- **Bull**: Task queue for managing asynchronous jobs.
- **TypeScript**: Adds type safety and enhances code readability.

### Frontend:

- **React**: For building the user interface.
- **TypeScript**: Ensures type safety and clean code.

## Prerequisites

1. Node.js (v16+ recommended)
2. Yarn or npm for dependency management
3. Redis server installed.
4. A GitHub Personal Access Token (PAT) with the necessary permissions to access repositories

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install root dependencies:

   ```bash
   npm install
   ```

3. Install client and server dependencies:

   ```bash
   npm run setup
   ```

4. Create a `.env` file in the server directory with the following content:

   ```env
   GITHUB_ACCESS_TOKEN=<your_personal_access_token>
   QUEUE_CONCURRENCY=<amount_of_parallel_jobs>
   ```

5. Start the project:
   ```bash
   npm run start
   ```
