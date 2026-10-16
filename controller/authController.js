import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import "dotenv/config"
import { sendMail, sentOTP } from "../helper/mailService.js"
import { generateOTP } from "../helper/otpService.js"



export const register = asyncHandel(async (req, res) => {
    try {
        const {
            username,
            email,
            phone,
            password,
            confirm_password,
            township,
            region,
            address
        } = req.body;

        if (!username || !email || !password || !phone || !confirm_password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                message: "Passwords do not match!",
                success: false
            });
        }

        const [checkEmail] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (checkEmail.length > 0) {
            return res.status(409).json({
                message: "Email already exists!",
                success: false
            });
        }


        const hashedPassword = await bcrypt.hash(password, 12);


        const otp = generateOTP();

        await db.query(
            "DELETE FROM otp_codes WHERE email = ?",
            [email]
        );


        await db.query(
            `INSERT INTO otp_codes (email, otp, expires_at)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 20 MINUTE))`,
            [email, otp]
        );

        await sentOTP(email, otp);


        const generateToken = jwt.sign(
            {
                username,
                email,
                phone,
                hashedPassword,
                township,
                region,
                address,
                role: "user"
            },
            process.env.JWT_SECRET,
            { expiresIn: "20m" }
        );

        return res.status(200).json({
            message: "OTP sent successfully",
            success: true,
            token: generateToken
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const verifyOTP = asyncHandel(async (req, res) => {
    try {
        const { email, otp, token } = req.body;

        if (!email || !otp || !token) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }

        const [checkOTP] = await db.query(
            `SELECT id
             FROM otp_codes
             WHERE email = ?
    AND otp = ?
        AND expires_at > NOW()`,
            [email, otp]
        );

        if (checkOTP.length === 0) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        let user;

        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(400).json({
                message: "Invalid or expired token",
                success: false
            });
        }


        if (user.email !== email) {
            return res.status(400).json({
                message: "Email does not match token",
                success: false
            });
        }


        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            await db.query(
                "DELETE FROM otp_codes WHERE email = ?",
                [email]
            );

            return res.status(409).json({
                message: "Email already exists!",
                success: false
            });
        }


        await db.query(
            `INSERT INTO users
       (username, email, phone, password, township, region, address)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                user.username,
                user.email,
                user.phone,
                user.hashedPassword,
                user.township || null,
                user.region || null,
                user.address || null
            ]
        );

        await db.query(
            "DELETE FROM otp_codes WHERE email = ?",
            [email]
        );

        await sendMail(
            email,
            "Account Registration Successful",
            "<h3>Please sign in to Kimberley Travel & Tours.</h3>"
        );

        return res.status(201).json({
            message: "Register Success",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


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

export const userList = asyncHandel(async (req, res) => {
    try {

        const [userInfo] = await db.query(
            `
            SELECT
            username, 
            email, 
            phone, 
            township, 
            region, 
            address,
            role
            FROM users
            ORDER BY id DESC
            `
        );
        return res.status(200).json({
            message: 'User List Success',
            success: true,
            userInfo
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
})