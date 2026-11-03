/**
 * Tiny in-memory hand-off between auth screens.
 * Holds sensitive values (pending registration credentials, reset tokens)
 * ONLY for the current navigation hop — never persisted, never in route
 * params, cleared as soon as it is taken.
 */
let pending = null;

export const setPendingAuth = (data) => {
  pending = data;
};

export const peekPendingAuth = () => pending;

export const takePendingAuth = () => {
  const data = pending;
  pending = null;
  return data;
};
