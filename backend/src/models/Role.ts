import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @HasMany(() => User)
  users?: User[];
}

export default Role;
