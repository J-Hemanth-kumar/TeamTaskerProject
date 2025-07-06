import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Tasks' })
export class Task extends Model<Task> {
  @Column({ type: DataType.STRING, allowNull: false })
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

  @Column(DataType.INTEGER)
  assigneeId?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  projectId!: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default Task;
