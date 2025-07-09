import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

// Interfaces for typing
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
  roleId: number;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare roleId: number;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }
}

export default User;
