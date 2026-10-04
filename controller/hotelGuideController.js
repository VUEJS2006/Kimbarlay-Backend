import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

export const hotelGuideList = asyncHandel(async (req, res) => {
    try {

        const [guides] = await db.query(`
            SELECT
                id,
                main_image,
                tag,
                created_at,
                updated_at
            FROM hotel_guides
            ORDER BY id DESC
        `);

        for (const guide of guides) {

            const [cards] = await db.query(
                `
                SELECT
                    id,
                    hotel_guide_id,
                    title,
                    badge,
                    image
                FROM hotel_cards
                WHERE hotel_guide_id = ?
                ORDER BY id ASC
                `,
                [guide.id]
            );

            guide.cards = cards;
        }

        return res.status(200).json({
            success: true,
            data: guides
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

export const hotelGuideCreate = asyncHandel(async (req, res) => {
    try {

        let {
            tag,
            title1,
            title2,
            title3,
            badge1,
            badge2,
            badge3
        } = req.body || {};


        if (
            !tag ||
            !title1 ||
            !title2 ||
            !title3 ||
            !badge1 ||
            !badge2 ||
            !badge3
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }


        const allowedTags = [
            "domestic",
            "asia",
            "europe"
        ];

        if (!allowedTags.includes(tag)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag!"
            });
        }

        if (
            !req.files ||
            !req.files.main_image ||
            !req.files.image1 ||
            !req.files.image2 ||
            !req.files.image3
        ) {
            return res.status(400).json({
                success: false,
                message: "Main image and 3 card images are required!"
            });
        }


        const uploadFolder = path.join(
            process.cwd(),
            "images",
            "hotel_guide"
        );

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, {
                recursive: true
            });
        }

        const mainFile = req.files.main_image[0];

        const mainFileName = `${uuid()}.webp`;

        const mainSavePath = path.join(
            uploadFolder,
            mainFileName
        );

        await sharp(mainFile.buffer)
            .resize({
                width: 1920,
                withoutEnlargement: true
            })
            .webp({
                quality: 90
            })
            .toFile(mainSavePath);

        const mainImage =
            `images/hotel_guide/${mainFileName}`;


        const [result] = await db.query(
            `
            INSERT INTO hotel_guides
            (
                main_image,
                tag
            )
            VALUES (?,?)
            `,
            [
                mainImage,
                tag
            ]
        );

        const hotelGuideId = result.insertId;


        const cardImages = [];

        const files = [
            req.files.image1[0],
            req.files.image2[0],
            req.files.image3[0]
        ];

        for (const file of files) {

            const fileName = `${uuid()}.webp`;

            const savePath = path.join(
                uploadFolder,
                fileName
            );

            await sharp(file.buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 90
                })
                .toFile(savePath);

            cardImages.push(
                `images/hotel_guide/${fileName}`
            );
        }

        const cards = [
            {
                title: title1,
                badge: badge1,
                image: cardImages[0]
            },
            {
                title: title2,
                badge: badge2,
                image: cardImages[1]
            },
            {
                title: title3,
                badge: badge3,
                image: cardImages[2]
            }
        ];


        for (const card of cards) {

            await db.query(
                `
                INSERT INTO hotel_cards
                (
                    hotel_guide_id,
                    title,
                    badge,
                    image
                )
                VALUES (?,?,?,?)
                `,
                [
                    hotelGuideId,
                    card.title,
                    card.badge,
                    card.image
                ]
            );
        }

        return res.status(201).json({
            success: true,
            message: "Hotel guide created successfully.",
            data: {
                hotelGuideId,
                main_image: mainImage,
                tag,
                cards
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const hotelGuideUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        let {
            tag,
            title1,
            title2,
            title3,
            badge1,
            badge2,
            badge3
        } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Hotel guide id is required!"
            });
        }
        const [guide] = await db.query(
            `
            SELECT
                id,
                main_image,
                tag
            FROM hotel_guides
            WHERE id = ?
            `,
            [id]
        );
        if (guide.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Hotel guide not found!"
            });
        }
        if (tag !== undefined) {

            const allowedTags = [
                "domestic",
                "asia",
                "europe"
            ];

            if (!allowedTags.includes(tag)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid tag!"
                });
            }

        } else {
            tag = guide[0].tag;
        }
        const [cards] = await db.query(
            `
            SELECT
                id,
                title,
                badge,
                image
            FROM hotel_cards
            WHERE hotel_guide_id = ?
            ORDER BY id ASC
            `,
            [id]
        );

        const uploadFolder = path.join(
            process.cwd(),
            "images",
            "hotel_guide"
        );


        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, {
                recursive: true
            });
        }
        let mainImage = guide[0].main_image;


        if (
            req.files &&
            req.files.main_image &&
            req.files.main_image.length > 0
        ) {

            const file = req.files.main_image[0];

            const fileName = `${uuid()}.webp`;

            const savePath = path.join(
                uploadFolder,
                fileName
            );


            await sharp(file.buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 90
                })
                .toFile(savePath);


            mainImage =
                `images/hotel_guide/${fileName}`;
        }
        await db.query(
            `
            UPDATE hotel_guides
            SET
                main_image = ?,
                tag = ?
            WHERE id = ?
            `,
            [
                mainImage,
                tag,
                id
            ]
        );
        const cardData = [
            {
                card: cards[0],
                title: title1,
                badge: badge1,
                file:
                    req.files?.image1?.[0] || null
            },
            {
                card: cards[1],
                title: title2,
                badge: badge2,
                file:
                    req.files?.image2?.[0] || null
            },
            {
                card: cards[2],
                title: title3,
                badge: badge3,
                file:
                    req.files?.image3?.[0] || null
            }
        ];
        for (const item of cardData) {

            const oldCard = item.card;


            const newTitle =
                item.title !== undefined
                    ? item.title
                    : oldCard.title;


            const newBadge =
                item.badge !== undefined
                    ? item.badge
                    : oldCard.badge;


            let newImage =
                oldCard.image;


            // New image uploaded
            if (item.file) {

                const fileName =
                    `${uuid()}.webp`;

                const savePath =
                    path.join(
                        uploadFolder,
                        fileName
                    );


                await sharp(item.file.buffer)
                    .resize({
                        width: 1920,
                        withoutEnlargement: true
                    })
                    .webp({
                        quality: 90
                    })
                    .toFile(savePath);


                newImage =
                    `images/hotel_guide/${fileName}`;
            }


            await db.query(
                `
                UPDATE hotel_cards
                SET
                    title = ?,
                    badge = ?,
                    image = ?
                WHERE id = ?
                `,
                [
                    newTitle,
                    newBadge,
                    newImage,
                    oldCard.id
                ]
            );

        }
        return res.status(200).json({
            success: true,
            message: "Hotel guide updated successfully."
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const hotelGuideDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

       
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Hotel guide id is required!"
            });
        }


        const [guide] = await db.query(
            `
            SELECT
                id,
                main_image
            FROM hotel_guides
            WHERE id = ?
            `,
            [id]
        );

        if (guide.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Hotel guide not found!"
            });
        }

    
        const [cards] = await db.query(
            `
            SELECT
                image
            FROM hotel_cards
            WHERE hotel_guide_id = ?
            `,
            [id]
        );

      

        await db.query(
            `
            DELETE FROM hotel_guides
            WHERE id = ?
            `,
            [id]
        );

       

        const mainImagePath = path.join(
            process.cwd(),
            guide[0].main_image
        );

        if (fs.existsSync(mainImagePath)) {
            fs.unlinkSync(mainImagePath);
        }

      

        for (const card of cards) {

            const cardImagePath = path.join(
                process.cwd(),
                card.image
            );

            if (fs.existsSync(cardImagePath)) {
                fs.unlinkSync(cardImagePath);
            }
        }


        return res.status(200).json({
            success: true,
            message: "Hotel guide deleted successfully."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
