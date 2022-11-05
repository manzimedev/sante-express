import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/AppError.js";

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({
      where: { id: req.params.id },
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const [row] = await Model.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!row) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: row,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const row = await Model.findByPk(req.params.id);

    if (!row) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: row,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const rows = await Model.findAll();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: rows.length,
      data: {
        data: rows,
      },
    });
  });

export default {
  createOne,
  deleteOne,
  getOne,
  updateOne,
  getAll,
};
