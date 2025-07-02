import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Task } from './Task';

@Table({ tableName: 'Projects' })
export class Project extends Model<Project> {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @HasMany(() => Task)
  tasks?: Task[];
}

export default Project;
