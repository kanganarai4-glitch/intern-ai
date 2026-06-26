/**
 * Utility: generate a standard success response
 */
const success = (res, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        ...data,
    });
};

/**
 * Utility: generate a standard error response
 */
const error = (res, message = 'Server Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

/**
 * Async handler wrapper – eliminates try/catch boilerplate in controllers
 * Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Paginate a mongoose query result array
 * @param {Array}  data      - Full results array
 * @param {number} page      - Current page (1-indexed)
 * @param {number} limit     - Items per page
 */
const paginate = (data, page = 1, limit = 10) => {
    const start  = (page - 1) * limit;
    const end    = start + limit;
    const sliced = data.slice(start, end);

    return {
        data:       sliced,
        total:      data.length,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(data.length / limit),
        hasNext:    end < data.length,
        hasPrev:    page > 1,
    };
};

module.exports = { success, error, asyncHandler, paginate };
