Users
-----
id UUID PRIMARY KEY
name VARCHAR
email VARCHAR UNIQUE
password VARCHAR
created_at TIMESTAMP

Projects
--------
id UUID PRIMARY KEY
name VARCHAR
description TEXT
owner_id UUID REFERENCES users(id)
created_at TIMESTAMP

Tasks
-----
id UUID PRIMARY KEY
title VARCHAR
description TEXT
status ENUM('Todo','In Progress','Done')
due_date TIMESTAMP
project_id UUID REFERENCES projects(id)
created_at TIMESTAMP