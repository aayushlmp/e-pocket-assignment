import { asyncHandler } from "../utils/async-handler.ts"
import { ApiResponse } from "../utils/api-response.ts"
const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(200).json(
        new ApiResponse(200, {
            success: true,
            status: 'OK',
            message: 'Server is healthy and running smoothly.',
            timestamp: new Date().toISOString()
        }, 'Server is healthy and running smoothly.',)
    )

})

export { healthcheck };
    