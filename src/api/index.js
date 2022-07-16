import express from "express";
import auth from "./auth";
import post from "./post";

const router = express.Router();

router.use("/auth", auth);
router.use("/post", post);

router.get("/", (req, res) =>{
    res.send("안녕 여긴 api야");
});

export default router;
