import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Users' })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;
}

export default User;
