"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdItem = new this.model(item);
                yield createdItem.save();
                return { item: createdItem };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 500) };
            }
        });
    }
    readAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.find(Object.assign({}, options === null || options === void 0 ? void 0 : options.condition)).sort(Object.assign({}, options === null || options === void 0 ? void 0 : options.sort));
                return { result };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.FETCH_FAILED, 500) };
            }
        });
    }
    readAllAndPopulate(populateWith, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.find(Object.assign({}, options === null || options === void 0 ? void 0 : options.condition), options === null || options === void 0 ? void 0 : options.projection).populate(populateWith, options === null || options === void 0 ? void 0 : options.selectField).sort(Object.assign({}, options === null || options === void 0 ? void 0 : options.sort));
                return { result };
            }
            catch (e) {
                console.log(e);
                return { error: new http_error_1.default(messages_1.default.FETCH_FAILED, 500) };
            }
        });
    }
    readById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findById(id, options === null || options === void 0 ? void 0 : options.projection).sort(Object.assign({}, options === null || options === void 0 ? void 0 : options.sort));
                return { result };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.FETCH_FAILED, 500) };
            }
        });
    }
    readByIdAndPopulate(id, populateWith, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findById(id, options === null || options === void 0 ? void 0 : options.projection).populate(populateWith).sort(Object.assign({}, options === null || options === void 0 ? void 0 : options.sort));
                return { result };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.FETCH_FAILED, 500) };
            }
        });
    }
    readOne(condition, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findOne(condition, options === null || options === void 0 ? void 0 : options.projection).sort(Object.assign({}, options === null || options === void 0 ? void 0 : options.sort));
                return { result };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.FETCH_FAILED, 500) };
            }
        });
    }
    readOneAndPopulate(condition, populateWith, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findOne(condition, options === null || options === void 0 ? void 0 : options.projection).populate(populateWith).sort(Object.assign({}, options === null || options === void 0 ? void 0 : options.sort));
                return { result };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.FETCH_FAILED, 500) };
            }
        });
    }
    update(updateId, updateItem) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findByIdAndUpdate(updateId, updateItem);
                if (!result) {
                    return { error: new http_error_1.default(messages_1.default.UPDATE_FAILED, 500) };
                }
                return { result };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.UPDATE_FAILED, 500) };
            }
        });
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=base-repository.js.map