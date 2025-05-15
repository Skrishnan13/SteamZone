
-- Users Table: Stores user information, including admins.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Store securely hashed passwords
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'user' COMMENT 'e.g., ''user'', ''admin''',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table: Stores video categories.
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY, -- Using VARCHAR to match mock data structure; consider INT AUTO_INCREMENT for new designs
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Videos Table: Core table for video information.
CREATE TABLE videos (
    id VARCHAR(50) PRIMARY KEY, -- Using VARCHAR to match mock data structure
    title VARCHAR(255) NOT NULL,
    description TEXT COMMENT 'Short description for cards',
    long_description TEXT COMMENT 'Detailed description for video page',
    thumbnail_url VARCHAR(500),
    video_url VARCHAR(500) COMMENT 'URL to the video file or stream manifest',
    data_ai_hint VARCHAR(100) COMMENT 'For AI-assisted thumbnail generation/search',
    duration VARCHAR(20) COMMENT 'e.g., "1h 30m" or "45m"',
    release_year INT,
    maturity_rating VARCHAR(20) COMMENT 'e.g., "PG-13", "TV-MA"',
    director VARCHAR(100),
    views INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'For hero banner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Genres Table: Stores distinct genre names.
CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video_Genres Junction Table: Maps videos to genres (many-to-many).
CREATE TABLE video_genres (
    video_id VARCHAR(50) NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (video_id, genre_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cast_Members Table: Stores distinct cast member names.
CREATE TABLE cast_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video_Cast Junction Table: Maps videos to cast members (many-to-many).
CREATE TABLE video_cast (
    video_id VARCHAR(50) NOT NULL,
    cast_member_id INT NOT NULL,
    PRIMARY KEY (video_id, cast_member_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (cast_member_id) REFERENCES cast_members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags Table: Stores distinct tag names.
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video_Tags Junction Table: Maps videos to tags (many-to-many).
CREATE TABLE video_tags (
    video_id VARCHAR(50) NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (video_id, tag_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video_Categories_Map Junction Table: Maps videos to categories (many-to-many).
CREATE TABLE video_categories_map (
    video_id VARCHAR(50) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (video_id, category_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments Table: Stores comments for videos.
CREATE TABLE comments (
    id VARCHAR(50) PRIMARY KEY, -- Using VARCHAR to match mock data structure
    video_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL COMMENT 'Denormalized for easier display, or join from users table',
    avatar_url VARCHAR(255),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id VARCHAR(50) COMMENT 'For replies, FK to comments.id',
    likes INT DEFAULT 0 COMMENT 'Simple like count on the comment itself',
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video_Interactions Table: Stores likes and dislikes for videos.
CREATE TABLE video_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    interaction_type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_video_interaction (user_id, video_id) COMMENT 'Ensures a user can only like or dislike a video once',
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: For the admin user (username: admin, password: Pass@123),
-- you will need to insert this into the 'users' table MANUALLY after hashing 'Pass@123'
-- using a secure hashing algorithm (e.g., bcrypt, Argon2) in your backend.
-- Example (conceptual, DO NOT store plain text passwords):
-- INSERT INTO users (username, password_hash, role) VALUES ('admin', 'your_securely_hashed_password_here', 'admin');

-- You may want to populate the 'genres', 'cast_members', and 'tags' tables with some initial data
-- depending on your application's needs.
-- Example:
-- INSERT INTO categories (id, name, description) VALUES ('action', 'Action Packed', 'Movies full of excitement.');
-- INSERT INTO genres (name) VALUES ('Action'), ('Comedy'), ('Drama'), ('Sci-Fi');

    