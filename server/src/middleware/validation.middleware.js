import ApiError from "../utils/helpers/errorHandler.js";

export const validate = (schema) => (req, res, next) => {
    try {
        console.log("Validating request body:", req.body);
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        console.error("Validation error details:", error.errors);
        const errorMessages = error.errors?.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        })) || [];

        const apiError = new ApiError(400, "Validation Error", errorMessages);
        next(apiError);
    }
};
