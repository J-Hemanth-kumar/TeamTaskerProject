import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Projects' })
export class Project extends Model<Project> {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;
}

export default Project;
