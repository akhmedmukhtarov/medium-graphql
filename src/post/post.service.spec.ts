import { PostService } from './post.service';
import { FindAllInput } from './dto/find-all.input';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('PostService', () => {
  const prismaService = new PrismaService
  const postService = new PostService(prismaService)

  describe('create', () => {
    it('should create a post', async () => {
      const createPostInput = { title: 'Test Post', content: 'Test Content' };
      const user = await prismaService.user.create({data:{
        email: String(Date.now()),
        hashedPassword: String(Date.now()),
        name: "strign",
        role: "user"
      }})
      const result = await postService.create(createPostInput, user.id);
      expect(result.content).toEqual(createPostInput.content);
      expect(result.title).toEqual(createPostInput.title);
      expect(result.authorId).toEqual(user.id);
    });
  });
  describe('findAll', () => {
    it('should find all posts', async () => {
      const user = await prismaService.user.create({data:{
        email: String(Date.now()),
        hashedPassword: String(Date.now()),
        name: "strign",
        role: "user"
      }})
      const createPostInput = {title: "someTitle",content: "someContent"}
      for(let i = 0; i < 15; i ++){
        postService.create(createPostInput, user.id)
      }
      const cursor = Buffer.from(String(1)).toString('base64')
      const findAllInput: FindAllInput = { cursor };
      const result = await postService.findAll(findAllInput);
      expect(result.posts.length).toBeLessThanOrEqual(10)
      expect(+Buffer.from(result.nextCursor,'base64').toString('ascii')).toBeGreaterThan(1)
      const result2 = await postService.findAll({limit: 3})
      expect(result2.posts.length).toBeLessThanOrEqual(3)
      expect(result2.totalPages).toBeGreaterThanOrEqual(5)
    });
  });

  describe('findOne', () => {
    it('should find one post', async () => {
      const user = await prismaService.user.create({data:{
        email: String(Date.now()),
        hashedPassword: String(Date.now()),
        name: "strign",
        role: "user"
      }})
      const post = await postService.create({title: "someTitle",content: "someContent"}, user.id)
      const result = await postService.findOne(post.id, user.id);
      expect(result.authorId).toEqual(user.id)
      const result2 = await postService.findOne(post.id, user.id);
      expect(result2.viewers[0].user.id).toEqual(user.id)
    });


    it('should throw 404 if no post found', async () => {
      const postId = 0;
      const userId = 1;

      expect(postService.findOne(postId, userId)).rejects.toThrowError(
        new HttpException(`No post found`, HttpStatus.NOT_FOUND),
      );
    });
  });
});
