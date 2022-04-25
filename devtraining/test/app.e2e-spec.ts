import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateCourses1650762281578 } from "../src/1650762281578-CreateCourses";
import { CreateTags1650763076254 } from "../src/1650763076254-CreateTags";
import { CreateCoursesTags1650763726150 } from "../src/1650763726150-CreateCoursesTags";
import { AddCoursesIdsToCoursesTags1650764015680 } from "../src/1650764015680-AddCoursesIdsToCoursesTags";
import { AddTagsIdsToCoursesTags1650764394917 } from "../src/1650764394917-AddTagsIdsToCoursesTags";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot({
        type: "postgres",
        host: "db-test",
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });
});
