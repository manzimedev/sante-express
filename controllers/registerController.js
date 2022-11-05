import factory from "./handlerFactory.js";
import Register from "../models/registerModel.js";

const createOne = factory.createOne(Register);

export default {
  createOne,
};
