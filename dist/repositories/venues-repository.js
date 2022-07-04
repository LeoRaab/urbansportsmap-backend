"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const venue_1 = require("../models/venue");
const base_repository_1 = require("./base-repository");
class VenuesRepository extends base_repository_1.default {
    constructor() {
        super(venue_1.default);
    }
}
exports.default = VenuesRepository;
//# sourceMappingURL=venues-repository.js.map