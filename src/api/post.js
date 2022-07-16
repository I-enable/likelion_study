import express from "express";
import { General } from '../../models';
import { verifyToken } from "./token";

const router = express.Router();

// 신청게시판 목록 조회(complete)
router.get("/", async (req, res) => {
    const data = await General.findAll({});
    
    // 데이터가 없을경우
    if(data.length === 0) {
        return res.json({
            data: "게시판이 비어있습니다."
        })
    }
    res.json({
        data: data
    })
});

router.get("/test", verifyToken, async (req, res) => {
    res.json(req.decoded.id);
})

// 신청게시판 등록 (complete)
router.post("/", verifyToken, async (req, res) => {
    const name = req.body.name;
    const content = req.body.content;
    const time = req.body.time;
    const dbcheck = await General.findAll({
        where:{
            time: time
        }
    });
    if (req.decoded.name == name) {
        if (dbcheck.length > 0) {
            return res.json({
                info : dbcheck[0],
                data : "이미 존재합니다."
            })
        }
        General.create({
            name: name,
            content: content,
            time: time
        });
    
        return res.json({
            data : "추가되었습니다."
        });
    }
    return res.json({
        data : "로그인 후 이용가능한 서비스 입니다."
    })
});

// 신청게시판 수정
router.put("/:postId", verifyToken, async (req, res) => {
    const { postId } = req.params;
    const content = req.body.content;
    const time = req.body.time;

    const dbcheckId = await General.findAll({
        where: {
            id: postId
        }
    });
    const dbcheckTime = await General.findAll({
        where: {
            time: time
        }
    });
    if (dbcheckTime[0] == undefined) {
        if (req.decoded.id == postId) {
            if (postId == dbcheckId[0].id) {
                General.update({
                    content: content,
                    time: time
                }, {
                    where: {
                        id : postId
                    }
                });
                return res.json({
                    data : dbcheckId[0].id+"번 유저 신청 내용이 수정되었습니다."
                }); 
            };
        };
    };

    if (time == dbcheckTime[0].time) {
        return res.json({
            info : dbcheckTime[0],
            data : "이미 존재합니다."
        })};
       
    console.log(time);
    console.log(dbcheckTime[0].time);
    
    return res.json({
        data : "로그인 후 이용가능한 서비스 입니다."
    });
    
});

// 신청게시판 삭제
router.delete("/:postId", verifyToken, async (req, res) => {
    const { postId } = req.params;

    const dbcheckId = await General.findAll({
        where: {
            id: postId
        }
    });
    if (req.decoded.id == postId) {
        if (dbcheckId[0] == undefined) {
            return res.json({
                data : "데이터가 존재하지 않습니다."
            });
        }
        else if (postId == dbcheckId[0].id) {
            General.destroy({
                where: {id : postId}
            });
            return res.json({
                data : "삭제되었습니다."
            });
        };
    };
    return res.json({
        data : "로그인 후 이용가능한 서비스 입니다."
    });
    
});

export default router;