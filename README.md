# Video Streaming Platform
[Website Link](https://video-streaming-app-1-kz3u.onrender.com/) (hosted on render)


This is a simple video streaming application built with Node.js, Express, and MongoDB. It allows users to browse a playlist of available videos and stream them on demand. The backend supports byte-range requests for efficient video seeking.

## Features

-   **Dynamic Playlist**: Fetches a list of available videos from a MongoDB database.
-   **Video Streaming**: Streams video files using Node.js `fs` module, with support for HTTP 206 Partial Content for seeking.
-   **RESTful API**: Provides endpoints to get the movie list and stream video content.
-   **Simple Frontend**: A clean, dark-themed user interface built with HTML, CSS, and vanilla JavaScript.
-   **Database Seeding**: Includes a script to easily populate the database with video metadata.

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Frontend**: HTML, CSS, JavaScript
-   **Environment Variables**: `dotenv`
-   **Development**: `nodemon` for live server reloading

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/) (a local instance or a cloud-based service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/sid-dev01/video-streaming-app.git
    cd video-streaming-app
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add your MongoDB connection URI:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```
    Replace `your_mongodb_connection_string` with your actual MongoDB URI.

4.  **Add Video Files:**
    Place your `.mp4` video files in the root directory of the project. The application is pre-configured to look for `cars1.mp4`, `planes.mp4`, `shrek.mp4`, `panda.mp4`, and `panda3.mp4`. You can either use these filenames or update the `addMovies.js` script with your own file names.

5.  **Seed the Database:**
    Run the seed script to populate your database with the video metadata from `addMovies.js`. This script will first clear any existing movies in the collection.
    ```sh
    npm run seed
    ```

6.  **Run the application:**
    -   For production mode:
        ```sh
        npm start
        ```
    -   For development mode with automatic restarts on file changes:
        ```sh
        npm run dev
        ```

7.  **Access the application** by opening your web browser and navigating to `http://localhost:3000`.

## API Endpoints

The application exposes the following API endpoints:

-   `GET /api/movies`
    -   **Description**: Retrieves a list of all available movies.
    -   **Response**: A JSON object containing a list of movies, each with an `id`, `title`, and `path`.
-   `GET /api/stream/:id`
    -   **Description**: Streams the video file corresponding to the provided `id`. It supports `Range` headers for video seeking.
    -   **URL Parameters**:
        -   `:id` (string, required): The MongoDB `_id` of the movie.

## File Structure

```
.
├── app.js               # Main Express server setup and DB connection
├── index.html           # Frontend HTML structure
├── style.css            # CSS for the frontend
├── route.js             # API route definitions
├── movieDB.js           # Mongoose schema for movies
├── addMovies.js         # Database seeding script
├── package.json         # Project dependencies and scripts
└── .env.example         # Example environment file