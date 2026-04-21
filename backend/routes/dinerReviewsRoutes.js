const router = require("express").Router();
const c = require("../controllers/dinerReviewsController");

router.post("/", c.createDinerReview);
router.get("/diner/:dinerId", c.getReviewsByDiner);
router.delete("/:id", c.deleteDinerReview);

module.exports = router;