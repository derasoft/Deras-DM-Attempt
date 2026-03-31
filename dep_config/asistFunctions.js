export function logout(res) {
    res.clearCookie('userName');
    res.clearCookie('userJWT');
    return res;
}