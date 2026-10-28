import { Repository } from "typeorm";
import { INote } from "@e-pocket-assignment/shared/interfaces";
import { ApiError } from "../utils/api-error.ts";
import { Note } from "../entities/Note.entity.ts";

export class NoteService {
  constructor(private noteRepository: Repository<Note>) {}
  async addNote(note: Partial<INote>) {
    try {
      return await this.noteRepository.save(note);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to add note"
        );
      }
    }
  }
}
