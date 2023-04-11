import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";

@Entity() // 해당 클래스는 DB 테이블
export class Post {
  @PrimaryGeneratedColumn() // Primary Key, 자동 생성
  id: number;

  @Column() // 하나의 테이블 어트리뷰트
  title: string;

  @Column()
  body: string;

  @CreateDateColumn() // 생성 시의 시간 자동 기록
  createdAt: Date;

  @UpdateDateColumn() // 수정 시의 시간 자동 기록
  updatedAt: Date;

  // foreign key
  @OneToMany(() => Comment, (comment) => comment.post) // comment의 post 부분과 연결
  comments: Comment[]; // 하나의 게시글에 댓글 배열
}
