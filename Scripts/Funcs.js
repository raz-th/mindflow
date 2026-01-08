export const limitText = (txt = "" , limit = 5) => {
    if (txt.length <= 5) return txt;
    return txt.slice(0, limit)+"...";

}