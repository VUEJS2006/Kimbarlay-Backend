import crypto from "crypto";
import { execFile } from "child_process";

// this function is not for frontend and just for auto deploy in name cheap 
// plsease, don't  change or delete anything
export const deployControllerFunction = async(req, res) => {
    const signature = req.headers["x-hub-signature-256"];

    if (!signature) {
        return res.status(401).json({
            message: "Missing GitHub signature"
        });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    const payload = JSON.stringify(req.body);

    const expectedSignature =
        "sha256=" +
        crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

    if (
        !crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        )
    ) {
        return res.status(401).json({
            message: "Invalid signature"
        });
    }

    res.status(200).json({
        message: "Deployment started"
    });

    execFile(
        "/home/magwkdjx/Kimbarlay-Backend/deploy.sh",
        (error, stdout, stderr) => {
            if (error) {
                console.error("Deployment failed:", error);
                console.error(stderr);
                return;
            }

            console.log("Deployment successful:");
            console.log(stdout);
        }
    )
}