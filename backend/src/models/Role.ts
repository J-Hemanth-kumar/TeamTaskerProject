import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Roles', timestamps: true })
export class Role extends Model<Role> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;
}

export default Role;
