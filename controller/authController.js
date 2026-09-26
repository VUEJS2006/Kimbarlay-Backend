import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { use } from "react"



export const register = asyncHandel(async (req, res) => {
    try {

        const { username, email, phone, password, confirm_password, township, region, address, } = req.body;

        if (!username || !email || !password || !phone) {
            return res.status(401).json({
                message: "All field are required",
                success: false
            })
        }

        const [checkEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (checkEmail.length > 0) {
            return res.status(401).json({
                message: "Email Already Exist!",
                success: false
            })
        }
        if (password !== confirm_password) {
            return res.status(401).json({
                message: "Password must be the same!",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const role = "user";
        const [data] = await db.query(
            `
            INSERT INTO users (username,email,phone,password,township,region,address,role) VALUES (?,?,?,?,?,?,?,?)
            `,
            [username, email, phone, hashedPassword, township, region, address, role]
        )
        const generateToken = jwt.sign(
            {
                id: data.insertId,
                username,
                email,
                role
            },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );
        res.status(201).json({
            message: "Register successfully",
            success: true,
            token: generateToken,
        });


    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message

            }
        );
    }
})

export const login = asyncHandel(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All field are required",
                success: false
            })
        }
        const [usersInfo] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = usersInfo[0];

        if (!user) {
            return res.status(401).json({
                message: 'user not found!',
                success: false
            })
        }
        if (!user.password) {
            return res.status(401).json({
                message: 'password not found!',
                success: false
            })
        }
        if (!user.email) {
            return res.status(500).json({
                message: "Email not found!",
                success: false
            });
        }
        const isMatchedPassword = await bcrypt.compare(password, user.password)
        if (!isMatchedPassword) {
            return res.status(401).json({ message: "Password does not match" });
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            message: "Login Success",
            success: true,
            token,
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                region: user.region,
                township: user.township,
                address: user.address,
            },
        })
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message

            }
        );
    }
})
export const logout = asyncHandel(async (req, res) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
})