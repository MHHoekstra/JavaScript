import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { CoursesModule } from "../../src/courses/courses.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateCourses1650762281578 } from "../../src/1650762281578-CreateCourses";
import { CreateTags1650763076254 } from "../../src/1650763076254-CreateTags";
import { CreateCoursesTags1650763726150 } from "../../src/1650763726150-CreateCoursesTags";
import { AddCoursesIdsToCoursesTags1650764015680 } from "../../src/1650764015680-AddCoursesIdsToCoursesTags";
import { AddTagsIdsToCoursesTags1650764394917 } from "../../src/1650764394917-AddTagsIdsToCoursesTags";
import { CreateCourseDto } from "../../src/courses/dto/create-course.dto";
import * as request from "supertest";

describe("Courses: /courses", () => {
  let app: INestApplication;

  const course: CreateCourseDto = {
    "name": "Fundamentos do framework NestJS",
    "description": "Fundamentos do framework NestJS",
    "tags": ["node.js", "nestjs", "javascript", "typescript"]
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoursesModule, TypeOrmModule.forRoot({
        type: "postgres",
        host: "localhost",
        port: 5433,
        username: "postgres",
        password: "docker",
        database: "devtraining-test",
        entities: ["dist/**/entities/*.js"],
        autoLoadEntities: true,
        migrations: [
          CreateCourses1650762281578,
          CreateTags1650763076254,
          CreateCoursesTags1650763726150,
          AddCoursesIdsToCoursesTags1650764015680,
          AddTagsIdsToCoursesTags1650764394917
        ],
        migrationsRun: true
      })]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Create POST /courses", async () => {
    const response = await request(app.getHttpServer()).post("/courses")
      .send(course)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toEqual(course.name);
    expect(response.body.description).toEqual(course.description);
    expect(response.body.tags.length).toEqual(course.tags.length);
  });
});
