import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Role } from './models/Role';
import { Project } from './models/Project';
import { Comment } from './models/Comment';
import { Task } from './models/Task';

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
  logging: false,
  models: [User, Role, Project, Comment, Task],
});

export default sequelize;
