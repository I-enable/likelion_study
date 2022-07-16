import express from "express";
import { User } from '../../models';
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";


const router = express.Router();

// 대학교 회원가입
router.post("/register", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const dbcheck = await User.findAll({
        where:{
            name : name
        }
    });

    if(dbcheck.length == 0) {
        let bypassword = await bcrypt.hash(password, 1);
        const newUser = await User.create({
            name : name,
            password : bypassword
        });
        return res.json({
            id : newUser.name,
            data : "회원가입 되었습니다."
        })
    }
    
    return res.json({
        data : "이미 회원가입 되었습니다."
    })
    
});

// 로그인
router.post("/login", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const dbcheck = await User.findAll({
        where:{
            name : name
        }
    });

    if(dbcheck.length == 1) {
        const same = bcrypt.compareSync(password, dbcheck[0].password);
        if (same) {
            const token = sign({
                id: dbcheck[0].id,
                name: dbcheck[0].name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m",
                issuer: "developer"
            }
        );
            return res.json({
                data : "토큰이 발급되었습니다. 10분동안 지속됩니다.",
                token
            });
        };
        
    };
    
    return res.json({
        data : "아이디가 존재하지 않습니다."
    })
    // 암호화
});

export default router;
