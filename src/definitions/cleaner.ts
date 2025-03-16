declare global {
  interface String {
    cleanse: (_STOPWORDS: string[]) => string;
  }
}

String.prototype.cleanse = function (_STOPWORDS: string[]) {
  let result = this.trim() // remove leading and trailing spaces
    .replace(/\s+/g, " ") // remove multiple spaces
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove emojis
    .toLowerCase();

  for (const stopword of _STOPWORDS) {
    result = result.replace(stopword, "");
  }

  return result.replace(/[^\w\s]/g, ""); // remove punctuation;
};
