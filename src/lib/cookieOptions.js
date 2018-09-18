import JwtCookieOptions from './classes/JwtCookieOptions';

export const token = new JwtCookieOptions();
export const authFlag = new JwtCookieOptions({httpOnly: false});
