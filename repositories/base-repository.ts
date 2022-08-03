import { Model, HydratedDocument, UnpackedIntersection, FilterQuery, UpdateQuery } from 'mongoose';
import {DeleteResult} from 'mongodb';
import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';


abstract class BaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: any): Promise<{ item?: HydratedDocument<T>; error?: HttpError }> {
    try {
      const createdItem = new this.model(item);
      await createdItem.save();
      return { item: createdItem };
    } catch (e) {
      return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) };
    }
  }

  async readAll(options?: {
    condition?: FilterQuery<T>;
    sort?: Record<string, 1 | -1>;
  }): Promise<{ result?: T[]; error?: HttpError }> {
    try {
      const result = await this.model.find<T>({ ...options?.condition }).sort({ ...options?.sort });
      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) };
    }
  }

  async readAllAndPopulate(
    populateWith: string,
    options?: {
      condition?: FilterQuery<T>;
      selectField?: string;
      projection?: string[];
      sort?: Record<string, 1 | -1>;
    },
  ): Promise<{ result?: T[] | null; error?: HttpError }> {
    try {
      const result = await this.model
        .find<T>({ ...options?.condition }, options?.projection)
        .populate(populateWith, options?.selectField)
        .sort({ ...options?.sort });
      return { result };
    } catch (e) {
      console.log(e);
      return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) };
    }
  }

  async readById(
    id: string,
    options?: { projection?: string[]; sort?: Record<string, 1 | -1> },
  ): Promise<{ result?: T | null; error?: HttpError }> {
    try {
      const result = await this.model.findById<T>(id, options?.projection).sort({ ...options?.sort });
      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) };
    }
  }

  async readByIdAndPopulate(
    id: string,
    populateWith: string | string[],
    options?: { projection?: string[]; sort?: Record<string, 1 | -1> },
  ): Promise<{ result?: Awaited<UnpackedIntersection<T, {}>> | null; error?: HttpError }> {
    try {
      const result = await this.model
        .findById<T>(id, options?.projection)
        .populate(populateWith)
        .sort({ ...options?.sort });
      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) };
    }
  }

  async readOne(
    condition: FilterQuery<T>,
    options?: { projection?: string[]; sort?: Record<string, 1 | -1> },
  ): Promise<{ result?: T | null; error?: HttpError }> {
    try {
      const result = await this.model.findOne(condition, options?.projection).sort({ ...options?.sort });
      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) };
    }
  }

  async readOneAndPopulate(
    condition: FilterQuery<T>,
    populateWith: string,
    options?: { projection?: string[]; sort?: Record<string, 1 | -1> },
  ): Promise<{ result?: Awaited<UnpackedIntersection<T, {}>> | null; error?: HttpError }> {
    try {
      const result = await this.model
        .findOne<T>(condition, options?.projection)
        .populate(populateWith)
        .sort({ ...options?.sort });
      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) };
    }
  }

  async updateById(updateId: string, updateItem: UpdateQuery<T>): Promise<{ result?: T; error?: HttpError }> {
    try {
      const result = await this.model.findByIdAndUpdate(updateId, updateItem);

      if (!result) {
        return { error: new HttpError(MESSAGES.UPDATE_FAILED, 500) };
      }

      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.UPDATE_FAILED, 500) };
    }
  }

  async updateByQuery(filterQuery: FilterQuery<T>, updateItem: UpdateQuery<T>): Promise<{ result?: T; error?: HttpError }> {
    try {
      const result = await this.model.findOneAndUpdate(filterQuery, updateItem);

      if (!result) {
        return { error: new HttpError(MESSAGES.UPDATE_FAILED, 500) };
      }

      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.UPDATE_FAILED, 500) };
    }
  }

  async delete(deleteId: string): Promise<{ result?: T; error?: HttpError }> {
    try {
      const result = await this.model.findByIdAndDelete(deleteId);

      if (!result) {
        return { error: new HttpError(MESSAGES.DELETE_FAILED, 500) };
      }

      return { result };
    } catch (e) {
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 500) };
    }
  }
}

export default BaseRepository;
