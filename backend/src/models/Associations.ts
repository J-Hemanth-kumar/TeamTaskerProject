import User from './User';
import Role from './Role';
import Task from './Task';
import Comment from './Comment';
import Project from './Project';

export function setupAssociations() {
  // Role ↔ Users
  Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

  // User ↔ Tasks
  User.hasMany(Task, { foreignKey: 'assigneeId', as: 'tasks' });
  Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

  // Project ↔ Tasks
  Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
  Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  // Task ↔ Comments
  Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
  Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

  // User ↔ Comments
  User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
  Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}
