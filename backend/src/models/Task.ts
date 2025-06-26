import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';
import { Project } from './Project';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.ENUM('todo', 'in_progress', 'done', 'tested'),
    allowNull: false,
    defaultValue: 'todo',
  })
  status!: 'todo' | 'in_progress' | 'done' | 'tested';

  @Column(DataType.DATE)
  deadline?: Date;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  assigneeId?: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  projectId!: number;

  @CreatedAt
  @Column({ field: 'createdAt' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  updatedAt!: Date;

  @BelongsTo(() => User, 'assigneeId')
  assignee?: User;

  @BelongsTo(() => Project, 'projectId')
  project?: Project;
}

export default Task;
