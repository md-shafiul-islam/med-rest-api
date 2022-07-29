import { Repository, TreeRepository } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Comment } from "../model/Comment";

class CommentService {
  private commentRepository: Repository<Comment>;
  private commentRepositoryTree: TreeRepository<Comment>;

  initRepository() {
    if (this.commentRepository === null) {
      this.commentRepository = AppDataSource.getRepository(Comment);
    }

    if (this.commentRepositoryTree === null) {
      this.commentRepositoryTree = AppDataSource.getTreeRepository(Comment);
    }
  }

  async getById(id: number) {
    try {
      const comment = this.commentRepository.findOne({ where: { id: id } });
      return comment;
    } catch (error) {
      apiWriteLog.error("Comment not found ", error);
      return null;
    }
  }

  async save(comment: Comment) {
    try {
      let initComment = this.commentRepository.create(comment);
      const saveComment = this.commentRepository.save(initComment);
      return saveComment;
    } catch (error) {
      apiWriteLog.error("Comment not found ", error);
      return null;
    }
  }

  
}

export const commentService = new CommentService();
