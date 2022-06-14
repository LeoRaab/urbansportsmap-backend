import { Model, HydratedDocument, UnpackedIntersection, FilterQuery, UpdateQuery } from "mongoose";
import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";

abstract class BaseRepository<T> {

    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: any): Promise<{ item?: HydratedDocument<T>, error?: HttpError }> {
        try {
            const createdItem = new this.model(item);
            await createdItem.save();
            return { item: createdItem }
        } catch (e) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) }
        }
    }

    async readAll(condition?: FilterQuery<T>): Promise<{ result?: T[], error?: HttpError }> {
        try {
            const result = await this.model.find<T>({ ...condition });
            return { result }
        } catch (e) {
            return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) }
        }
    }

    async readAllAndPopulate(populateWith: string, condition?: FilterQuery<T>, selectField?: string, projection?: string[]): Promise<{ result?: T[] | null, error?: HttpError }> {
        try {
            const result = await this.model.find<T>({ ...condition }, projection).populate(populateWith, selectField);
            return { result }
        } catch (e) {
            console.log(e);
            return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) }
        }
    }

    async readById(id: string, projection?: string[]): Promise<{ result?: T | null, error?: HttpError }> {
        try {
            const result = await this.model.findById<T>(id, projection);
            return { result }
        } catch (e) {
            return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) }
        }
    }

    async readByIdAndPopulate(id: string, populateWith: string | string[], projection?: string[]): Promise<{ result?: Awaited<UnpackedIntersection<T, {}>> | null, error?: HttpError }> {
        try {
            const result = await this.model.findById<T>(id, projection).populate(populateWith);
            return { result }
        } catch (e) {
            return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) }
        }
    }

    async readOne(condition: FilterQuery<T>, projection?: string[]): Promise<{ result?: T | null, error?: HttpError }> {
        try {
            const result = await this.model.findOne(condition, projection);
            return { result }
        } catch (e) {
            return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) }
        }
    }

    async readOneAndPopulate(condition: FilterQuery<T>, populateWith: string, projection?: string[]): Promise<{ result?: Awaited<UnpackedIntersection<T, {}>> | null, error?: HttpError }> {
        try {
            const result = await this.model.findOne<T>(condition, projection).populate(populateWith);
            return { result }
        } catch (e) {
            return { error: new HttpError(MESSAGES.FETCH_FAILED, 500) }
        }
    }

    async update(updateId: string, updateItem: UpdateQuery<T>): Promise<{ result?: T, error?: HttpError }> {
        try {
            const result = await this.model.findByIdAndUpdate(updateId, updateItem);

            if (!result) {
                return { error: new HttpError(MESSAGES.UPDATE_FAILED, 500) }
            }

            return { result }
        } catch (e) {
            return { error: new HttpError(MESSAGES.UPDATE_FAILED, 500) }
        }
    }

}

export default BaseRepository;