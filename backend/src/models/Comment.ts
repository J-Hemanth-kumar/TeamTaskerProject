import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Task } from './Task';

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment> {
  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: false })
  taskId!: number;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Task)
  task?: Task;
}

export default Comment;
