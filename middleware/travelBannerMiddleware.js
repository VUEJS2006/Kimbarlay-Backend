export const setIdForChoosingBanner = ({id}) => {
    return (req , res, next) => {
        if(!id) {
            return res.status(500).json({
                status : false,
                message : "Forget to set id, tell the backend developer, please."
            })
        }
        req.id = id;
        next();
    }
}