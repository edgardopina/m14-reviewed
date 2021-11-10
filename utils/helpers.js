function format_date(date) {
   return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function format_plural(word, amount) {
   if (amount !== 1) {
      return `${word}s`;
   }
   return word;
}

function format_url(url) {
   return url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')[0]
      .split('?')[0];
}

module.exports = { format_date, format_plural, format_url };
