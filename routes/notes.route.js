const router = require("express").Router();
const auth = require("../auth");
const notesModel = require("../models/notes.model");

/**
 * @route /api/notes
 * gets a list of all notes
 */
router.route("/").get(auth, (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ ok: false, error: "You need to be authenticated" });
  }
  notesModel
    .find({ userId: req.user.userId })
    .then((res_) => {
      return res.send({ ok: true, notesList: res_ });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ status: "error", message: "Internal server error" });
    });
});

/**
 * @route /api/notes POST
 * creates new note
 */
router.route("/").post(auth, async (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ ok: false, error: "You need to be authenticated" });
  }

  if (!req.body || !req.body.title) {
    return res
      .status(400)
      .send({ ok: false, error: "Title is a required field" });
  }

  const newNotes = await notesModel({
    userId: req.user.userId,
    title: req.body.title,
    content: req.body.content,
  });
  newNotes
    .save()
    .then((res_) => {
      return res.send({
        ok: true,
        message: "Notes saved successfully",
        notes_: res_,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ status: "error", message: "Internal server error" });
    });
});

/**
 * PUT @route /api/notes
 * updates existing notes
 */
router.route("/").put(auth, (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ ok: false, error: "You need to be authenticated" });
  }

  if (!req.body.notesId) {
    return res.status(400).send({ ok: false, error: "NotesId is required" });
  }

  if (!req.body.title && !req.body.content) {
    return res.status(400).send({
      ok: false,
      error: "Need title or content in the body in order to perform update",
    });
  }
  const updatedValues = {};
  if (req.body.title) {
    updatedValues.title = req.body.title;
  }
  if (req.body.content) {
    updatedValues.content = req.body.content;
  }

  try {
    notesModel
      .findOneAndUpdate({ _id: req.body.notesId }, { ...updatedValues })
      .then((res_) => {
        return res.status(200).send({ ok: true, notesId: res_._id });
      })
      .catch((err) => {
        return res.status(500).send({
          status: "error",
          message: "No Notes exists with given id",
          err,
        });
      });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error", error });
  }
});

/**
 * get notes with given id
 * @route /api/notes/:id
 */

router.route("/:id").get(auth, (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ ok: false, error: "You need to be authenticated" });
  }

  try {
    notesModel
      .findOne({ _id: req.params.id })
      .then((res_) => {
        return res.status(200).send({ ok: true, notes: res_ });
      })
      .catch((err) => {
        return res.status(404).send({ ok: false, message: "No Notes exists" });
      });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error", error });
  }
});

/**
 * Delete notes
 * @route /api/notes DELETE
 */
router.route("/").delete(auth, (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ ok: false, error: "You need to be authenticated" });
  }

  if (!req.body.notesId) {
    return res.status(400).send({ ok: false, error: "NotesId is required" });
  }

  try {
    notesModel
      .deleteOne({ _id: req.body.notesId })
      .then((res_) => {
        if (res_.deletedCount === 0) {
          return res
            .status(404)
            .send({ ok: false, message: "No Notes exists" });
        }
        return res.status(200).send({ ok: true, notes: res_ });
      })
      .catch((err) => {
        return res.status(404).send({ ok: false, message: "No Notes exists" });
      });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error", error });
  }
});

module.exports = router;
