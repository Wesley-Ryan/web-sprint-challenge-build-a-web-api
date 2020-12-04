const express = require("express");
const Actions = require("./actions-model");

const router = express.Router();

const validateId = (req, res, next) => {
  const { id } = req.params;
  Actions.get(id).then((actionID) => {
    if (actionID) {
      req.id = id;
      next();
    } else {
      res.status(404).json({ message: `user with id ${id} not found` });
    }
  });
};

const validateAction = (req, res, next) => {
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).json({ message: "Missing required information." });
  } else {
    next();
  }
};

router.get("/", (req, res) => {
  Actions.get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.get("/:id", validateId, (req, res) => {
  const { id } = req.params;

  Actions.get(id)
    .then((actID) => {
      if (actID) {
        res.status(200).json(actID);
      } else {
        res.status(404).json({ message: "The requested ID does not exist" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.post("/", validateAction, (req, res) => {
  const newAction = req.body;

  Actions.insert(newAction)
    .then((actions) => {
      res.status(201).json(actions);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.put("/:id", validateId, validateAction, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Actions.update(id, changes)
    .then((updatedAct) => {
      if (updatedAct) {
        res.status(201).json(updatedAct);
      } else {
        res
          .status(400)
          .json({ message: `The requested action doesn't exist.` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.delete("/:id", validateId, (req, res) => {
  Actions.remove(req.params.id)
    .then((removed) => {
      if (removed) {
        res.status(200).json({ message: "Item Removed." });
      } else {
        res
          .status(404)
          .json({ message: "There was an issue removing the item." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
