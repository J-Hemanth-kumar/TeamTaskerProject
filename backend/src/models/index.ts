import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Project } from './Project';
import { Task } from './Task';

@Table
export class Role extends Model {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;
}

@Table
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;
}

@Table
export class Project extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @HasMany(() => Task)
  tasks!: Task[];
}

@Table
export class Task extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'todo' })
  status!: string;

  @Column({ type: DataType.DATE })
  deadline?: Date;

  @Column({ type: DataType.INTEGER })
  assigneeId?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  projectId!: number;
}

@Table
export class Comment extends Model {
  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  taskId!: number;
}
