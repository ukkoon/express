export function generateAuthcode(intlPhonenum: string): string {
    var min = Math.ceil(100000);
    var max = Math.floor(999999);
    return (Math.floor(Math.random() * (max - min)) + min).toString();
}