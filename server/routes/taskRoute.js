const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
    createTodo,
    editTodo,
    markCompleteTodo,
    deleteTodo
} = require("../controllers/task");

const { getUserTask } = require("../controllers/getTask");

const {
    createSubTask,
    markCompleteSubTask,
} = require("../controllers/subTask");


router.post("/create-task", auth, createTodo);
router.put("/edit-task", auth, editTodo);
router.put("/complete-task", auth, markCompleteTodo);
router.delete("/delete-task", auth, deleteTodo);


router.get("/user-task", auth, getUserTask);


router.post("/create-subtask", auth, createSubTask);
router.put("/complete-subtask", auth, markCompleteSubTask);

module.exports = router;
