import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let repo: Repository<Course>;
  let tagRepo: Repository<Tag>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useClass: Repository },
        { provide: getRepositoryToken(Tag), useClass: Repository },
      ],
    }).compile();
    repo = module.get<Repository<Course>>(getRepositoryToken(Course));
    tagRepo = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('search course by Id', () => {
      it('should return an object Course when one exists', async function () {
        const courseId = '1';
        const expectCourse = new Course();
        expectCourse.id = courseId;

        jest.spyOn(repo, 'findOne').mockResolvedValueOnce(expectCourse);
        const course = await service.findOne(courseId);

        expect(course).toBe(expectCourse);
      });
      it('should return NotFoundException when no one exists', async function () {
        const courseId = '1';

        try {
          jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);
          const course = await service.findOne(courseId);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toEqual(`Course ID ${courseId} not found`);
        }
      });
    });
  });
});
