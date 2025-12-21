/**
 * Encode object to base64 string
 */
export const encodeCursor = (cursorObj) => {
  return Buffer.from(JSON.stringify(cursorObj)).toString('base64')
}

/**
 * Decode base64 string to object
 */
export const decodeCursor = (cursorString) => {
  try {
    return JSON.parse(Buffer.from(cursorString, 'base64').toString('utf-8'))
  } catch (e) {
    return null
  }
}
