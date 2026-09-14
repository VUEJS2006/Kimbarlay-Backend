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

// backend domain url + image location = full url
export const changeToImageFullUrl = (image_url) => {
    const backendDomainUrl = process.env.BACKEND_DOMAIN_URL;

    return `${backendDomainUrl}/${image_url}`;
}