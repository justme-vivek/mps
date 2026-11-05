/**
 * Optional, backward-compatible pagination for list endpoints.
 *   GET /api/notices                → full array (unchanged behaviour)
 *   GET /api/notices?page=2&limit=12 → that page, total in `X-Total-Count`
 * `limit` is capped at 50 so a client can never request an unbounded page.
 */
const MAX_LIMIT = 50;

async function findPaged(model, filter, sort, req, res) {
  const requested = parseInt(req.query.limit, 10);
  if (!requested || requested < 1) return model.find(filter).sort(sort);

  const limit = Math.min(requested, MAX_LIMIT);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const [items, total] = await Promise.all([
    model
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    model.countDocuments(filter),
  ]);
  res.set('X-Total-Count', String(total));
  return items;
}

module.exports = { findPaged };
