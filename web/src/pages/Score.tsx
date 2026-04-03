import { Navigate } from 'react-router-dom'

/**
 * /score redirects to /my-possiblist which handles both
 * authenticated and anonymous users with the full scorecard.
 */
export function Score() {
  return <Navigate to="/my-possiblist" replace />
}
