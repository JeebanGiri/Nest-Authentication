import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "path";

export const dataSourceOption: DataSourceOptions ={
    type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_DATABASE || 'nestcrud',
        entities: [join(process.cwd(), 'dist/**/*.entity.js')], // entity classes
        migrations: ['dist/db/migrations/*.js'],
        synchronize: true,
}

const dataSource = new DataSource(dataSourceOption);
export default dataSource;