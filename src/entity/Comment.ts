import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";

@Entity() // 이 클래스는 DB 테이블
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  // foreign key
  @ManyToOne(() => Post, (post) => post.comments) // post의 comments 부분과 연결
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
