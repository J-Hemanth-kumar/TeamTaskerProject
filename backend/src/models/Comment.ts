import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Comments' })
export class Comment extends Model<Comment> {
  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  taskId!: number;
}

export default Comment;
