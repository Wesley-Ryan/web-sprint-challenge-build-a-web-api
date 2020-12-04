const express = require("express");
const Projects = require("./projects-model");
const router = express.Router();

const validateId = (req, res, next) => {
  const { id } = req.params;
  Projects.get(id).then((projID) => {
    if (projID) {
      req.id = id;
      next();
    } else {
      res.status(404).json({ message: `user with ID ${id} not found` });
    }
  });
};

const validateProject = (req, res, next) => {
  if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: "Missing required information." });
  } else {
    next();
  }
};

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.get("/:id/actions", validateId, (req, res) => {
  const { id } = req.params;

  Projects.getProjectActions(id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.get("/:id", validateId, (req, res) => {
  const { id } = req.params;

  Projects.get(id)
    .then((projID) => {
      if (projID) {
        res.status(200).json(projID);
      } else {
        res.status(404).json({ message: "The requested ID does not exist" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.post("/", validateProject, (req, res) => {
  Projects.insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.put("/:id", validateId, validateProject, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Projects.update(id, changes)
    .then((updatedProj) => {
      if (updatedProj) {
        res.status(201).json(updatedProj);
      } else {
        res
          .status(400)
          .json({ message: "There was an issue updating the project." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
router.delete("/:id", validateId, (req, res) => {
  const { id } = req.params;

  Projects.remove(id)
    .then((test) => {
      if (test) {
        res.status(200).json({ message: "Project removed." });
      } else {
        res
          .status(404)
          .json({ message: "We were unable to remove the project." });
      }
    })
    .catch((error) => {
      res.status().json({ error: error.message });
    });
});

module.exports = router;
