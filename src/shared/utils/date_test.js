const date = new Date(2026, 3, 12); // April 12, 2026
const hijri = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', { day: 'numeric' }).format(date);
const gregorian = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date);

console.log(`Date: ${date.toDateString()}`);
console.log(`Hijri Day: ${hijri}`);
console.log(`Gregorian Day: ${gregorian}`);
console.log(`Is Different: ${hijri !== gregorian}`);
