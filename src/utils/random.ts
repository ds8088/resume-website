export const randomString = (sz: number, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') => {
    const raw = new Uint32Array(sz);
    crypto.getRandomValues(raw);

    let res = '';
    for (let i = 0; i < sz; i++) {
        res += chars[(raw[i] ?? 0) % chars.length];
    }

    return res;
};
