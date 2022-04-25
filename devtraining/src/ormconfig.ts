import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CreateCourses1650762281578 } from './1650762281578-CreateCourses';
import { CreateTags1650763076254 } from './1650763076254-CreateTags';
import { CreateCoursesTags1650763726150 } from './1650763726150-CreateCoursesTags';
import { AddCoursesIdsToCoursesTags1650764015680 } from './1650764015680-AddCoursesIdsToCoursesTags';
import { AddTagsIdsToCoursesTags1650764394917 } from './1650764394917-AddTagsIdsToCoursesTags';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'devtraining',
  entities: ['dist/**/entities/*.js'],
  autoLoadEntities: true,
  migrations: [
    CreateCourses1650762281578,
    CreateTags1650763076254,
    CreateCoursesTags1650763726150,
    AddCoursesIdsToCoursesTags1650764015680,
    AddTagsIdsToCoursesTags1650764394917,
  ],
  migrationsRun: true,
};
export { config };
