import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export const storeImageToDynamicFolder = async(file, subFolder) => {
    if (!file || !subFolder) {
        return null;
    }

    const uploadFolder = path.join(
        process.cwd(),
        "images",
        subFolder
    );

    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, {
            recursive: true
        });
    }

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
            quality: 95
        })
        .toFile(savePath);

    return `images/${subFolder}/${fileName}`;
}

// delete image from storage
export const deleteStoredImage = async(imageUrl) => {

    const fileLocationToDelete = path.join(
        process.cwd(),
        imageUrl
    )

    if (fs.existsSync(fileLocationToDelete)) {
        await fs.promises.unlink(fileLocationToDelete)
    }
}

export const deleteManyStoredImages = async (imageUrls = []) => {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

    const deletePromises = imageUrls.map(async (imageUrl) => {
        if (!imageUrl) return;

        const fileLocationToDelete = path.join(process.cwd(), imageUrl);

        try {
            if (fs.existsSync(fileLocationToDelete)) {
                await fs.promises.unlink(fileLocationToDelete);
            }
        } catch (error) {
            console.error(`Failed to delete file: ${fileLocationToDelete}`, error);
        }
    });

    await Promise.all(deletePromises);
};

// backend domain url + image location = full url
export const changeToImageFullUrl = (image_url) => {
    const backendDomainUrl = process.env.BACKEND_DOMAIN_URL;

    if(image_url)
    return `${backendDomainUrl}/${image_url}`;
    else
    return null;
}

