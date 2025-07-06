import { Sequelize } from 'sequelize-typescript';
import User from './models/User';
import Role from './models/Role';
import Task from './models/Task';
import Comment from './models/Comment';
import Project from './models/Project';

import { setupAssociations } from './models/Associations';

// Debug: Log DB_PASS and its type
console.log('DB_PASS:', process.env.DB_PASS, typeof process.env.DB_PASS);


const sequelize = new Sequelize({
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  models: [User, Role, Task, Comment, Project],
});

setupAssociations();

export default sequelize;
