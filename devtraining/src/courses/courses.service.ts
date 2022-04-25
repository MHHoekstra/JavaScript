import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Tag } from './entities/tag.entity';
import { v4 } from 'uuid';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({ relations: ['tags'] });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const tags = await Promise.all(
      createCourseDto.tags.map((name) => this.preloadTagByName(name)),
    );
    const course = this.courseRepository.create();
    course.name = createCourseDto.name;
    course.description = createCourseDto.description;
    course.tags = tags;
    await this.courseRepository.save(course);
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const tags =
      updateCourseDto.tags &&
      (await Promise.all(
        updateCourseDto.tags.map((name) => this.preloadTagByName(name)),
      ));
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new HttpException(
        `Course ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    course.name = updateCourseDto.name ?? course.name;
    course.description = updateCourseDto.description ?? course.description;
    course.tags = tags ?? course.tags;
    await this.courseRepository.save(course);
    return course;
  }

  async remove(id: string): Promise<void> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new HttpException(
        `Course ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.courseRepository.remove(course);
  }

  private async preloadTagByName(description: string): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ description });
    console.log(tag);
    if (tag) {
      return tag;
    }
    const tagEntity = this.tagRepository.create({ description, id: v4() });
    await this.tagRepository.save(tagEntity);
    return tagEntity;
  }
}
