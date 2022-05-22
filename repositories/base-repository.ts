import { Model, HydratedDocument, UnpackedIntersection } from "mongoose";
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
            return { error: new HttpError('Creating item failed, please try again later.', 500) }
        }
    }

    async readAll(condition?: object): Promise<{ result?: T[], error?: HttpError }> {
        try {
            const result = await this.model.find<T>({ condition });
            return { result }
        } catch (e) {
            return { error: new HttpError('Fetching items failed, please try again later.', 500) }
        }
    }

    async readAllAndPopulate(condition: object, populateWith: string, selectField?: string, projection?: string[]): Promise<{ result?: T[] | null, error?: HttpError }> {
        try {
            const result = await this.model.find<T>(condition, projection).populate(populateWith, selectField);
            return { result }
        } catch (e) {
            console.log(e);
            return { error: new HttpError('Fetching item failed, please try again later.', 500) }
        }
    }

    async readById(id: string, projection?: string[]): Promise<{ result?: T | null, error?: HttpError }> {
        try {
            const result = await this.model.findById<T>(id, projection);
            return { result }
        } catch (e) {
            return { error: new HttpError('Fetching item failed, please try again later.', 500) }
        }
    }

    async readByIdAndPopulate(id: string, populateWith: string, projection?: string[]): Promise<{ result?: Awaited<UnpackedIntersection<T, {}>> | null, error?: HttpError }> {
        try {
            const result = await this.model.findById<T>(id, projection).populate(populateWith);
            return { result }
        } catch (e) {
            return { error: new HttpError('Fetching item failed, please try again later.', 500) }
        }
    }

    async readOne(condition: object, projection?: string[]): Promise<{ result?: T | null, error?: HttpError }> {
        try {
            const result = await this.model.findOne(condition, projection);
            return { result }
        } catch (e) {
            return { error: new HttpError('Fetching item failed, please try again later!', 500) }
        }
    }

    async readOneAndPopulate(condition: object, populateWith: string, projection?: string[]): Promise<{ result?: Awaited<UnpackedIntersection<T, {}>> | null, error?: HttpError }> {
        try {
            const result = await this.model.findOne<T>(condition, projection).populate(populateWith);
            return { result }
        } catch (e) {
            return { error: new HttpError('Fetching item failed, please try again later.', 500) }
        }
    }

    async update(updateId: string, updateItem: object): Promise<{ result?: T, error?: HttpError }> {
        try {
            const result = await this.model.findByIdAndUpdate(updateId, updateItem);

            if (!result) {
                return { error: new HttpError('Updating item failed, please try again later.', 500) }
            }
            
            return { result }
        } catch (e) {
            return { error: new HttpError('Updating item failed, please try again later.', 500) }
        }
    }

}

export default BaseRepository;