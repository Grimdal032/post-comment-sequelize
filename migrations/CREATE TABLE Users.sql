CREATE TABLE Users
(
    userId       int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID           varchar(255) UNIQUE NOT NULL,
    nickname     varchar(255) UNIQUE NOT NULL,
    password     varchar(255)        NOT NULL,
    createdAt    datetime            NOT NULL DEFAULT NOW(),
    updatedAt    datetime            NOT NULL DEFAULT NOW()
);

CREATE TABLE Likes
(
    likeId       int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postId       int(11)             NOT NULL,
    userId       int(11)             NOT NULL,
    createdAt    datetime            NOT NULL DEFAULT NOW(),
    updatedAt    datetime            NOT NULL DEFAULT NOW(),
    FOREIGN KEY (postId) REFERENCES Posts (postId),
    FOREIGN KEY (userId) REFERENCES Users (userId)
);

CREATE TABLE Posts
(
    postId       int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId       int(11)             NOT NULL,
    title        varchar(255)        NOT NULL,
    content      varchar(255)        NOT NULL,
    createdAt    datetime            NOT NULL DEFAULT NOW(),
    updatedAt    datetime            NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES Users (userId)
);

CREATE TABLE Comments
(
    commentId    int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postId       int(11)             NOT NULL,
    userId       int(11)             NOT NULL,
    title        varchar(255)        NOT NULL,
    content      varchar(255)        NOT NULL,
    createdAt    datetime            NOT NULL DEFAULT NOW(),
    updatedAt    datetime            NOT NULL DEFAULT NOW(),
    FOREIGN KEY (postId) REFERENCES Posts (postId),
    FOREIGN KEY (userId) REFERENCES Users (userId)
);

npx sequelize model:generate --name Users --attributes ID:string,password:string,nickname:string
npx sequelize model:generate --name Likes --attributes postId:integer,userId:integer
npx sequelize model:generate --name Posts --attributes userId:integer,title:string,content:string
npx sequelize model:generate --name Comments --attributes postId:integer,userId:integer,title:string,content:string