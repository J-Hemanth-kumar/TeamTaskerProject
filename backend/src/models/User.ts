import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Role } from './Role';
import { Task } from './Task';
import { Comment } from './Comment';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;

  @BelongsTo(() => Role)
  role?: Role;

  @HasMany(() => Task, 'assigneeId')
  tasks?: Task[];

  @HasMany(() => Comment)
  comments?: Comment[];
}

export default User;
