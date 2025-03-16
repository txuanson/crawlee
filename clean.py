import os
import json
import re
import nltk
from nltk.stem import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
import spacy
import argparse
import string
import spacy.cli
import spacy.cli.download
from tqdm import tqdm

spacy.cli.download('en_core_web_sm')
nltk.download('stopwords')
nltk.download('wordnet')

nlp = spacy.load("en_core_web_sm")

def remove_emojis(data):
  """
    Remove emojis

    Ref: https://stackoverflow.com/questions/33404752/removing-emojis-from-a-string-in-python
  """
  emoj = re.compile("["
    u"\U0001F600-\U0001F64F"  # emoticons
    u"\U0001F300-\U0001F5FF"  # symbols & pictographs
    u"\U0001F680-\U0001F6FF"  # transport & map symbols
    u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
    u"\U00002702-\U000027B0"
    u"\U000024C2-\U0001F251"
    u"\U0001f926-\U0001f937"
    u"\U00010000-\U0010ffff"
    u"\u2640-\u2642" 
    u"\u2600-\u2B55"
    u"\u200d"
    u"\u23cf"
    u"\u23e9"
    u"\u231a"
    u"\ufe0f"  # dingbats
    u"\u3030"
  "]+", re.UNICODE)
  return re.sub(emoj, ' ', data)


def clean_text(text: str, stem: str = None):
  """
    Clean text

    Notes: all the replace steps will replace the word with a space 
    to make sure the word with human typo issues are not removed
    Ex: `transportation,machine` -> `transportation machine` instead of `transportationmachine`

    Steps:
    1. Lowercase
    2. Remove new lines
    3. Remove emojis
    4. Remove punctuation
    5. Remove stopwords
    6. Stem or Lemmatize

    Ref: https://devskrol.com/2021/11/28/spacy-stemming-vs-lemmatization/ with some additional modifications
  """
  final_string = ""

  text = text.lower()

  text = re.sub(r'\n', ' ', text)

  text = remove_emojis(text)

  translator = str.maketrans(string.punctuation, ' ' * len(string.punctuation))
  text = text.translate(translator)

  text = text.split()
  useless_words = nltk.corpus.stopwords.words("english")
  useless_words = useless_words + ['hi', 'im']

  text_filtered = [word for word in text if not word in useless_words]

  if stem == 'Stem':
    stemmer = PorterStemmer() 
    text_stemmed = [stemmer.stem(y) for y in text_filtered]
  elif stem == 'Lem':
    lem = WordNetLemmatizer()
    text_stemmed = [lem.lemmatize(y) for y in text_filtered]
  elif stem == 'Spacy':
    text_filtered = nlp(' '.join(text_filtered))
    text_stemmed = [y.lemma_ for y in text_filtered]
  else:
    text_stemmed = text_filtered

  final_string = ' '.join(text_stemmed)

  return final_string

# ArgParse
parser = argparse.ArgumentParser()
parser.add_argument('-d', '--data', type=str, default='storage/datasets/default', help='Path to data directory')
parser.add_argument('-o', '--output', type=str, default='output', help='Path to output directory')
parser.add_argument('-s', '--stem', type=str, default=None, choices=['Stem', 'Lem', 'Spacy'], help='Stem or Lemmatize')
parser.add_argument('--save-raw', type=bool, default=False, help='Save RAW files')
args = parser.parse_args()

# list all files in directory
files = os.listdir(args.data)

OUT_DIR = args.output
OUT_DIR_RAW = f'{OUT_DIR}/raw'
OUT_DIR_CLEANED = f'{OUT_DIR}/{args.stem.lower()}'

# create output directory
if args.save_raw:
  os.makedirs(OUT_DIR_RAW, exist_ok=True)
os.makedirs(OUT_DIR_CLEANED, exist_ok=True)

# loop through files
for file in tqdm(files):
  # check if file is json
  if file.endswith('.json'):
    # open file
    with open(f'{args.data}/{file}', 'r', encoding='utf-8') as f:
      # read file
      data = json.load(f)

      # write RAW file
      if args.save_raw:
        with open(f'{OUT_DIR_RAW}/{file}', 'w', encoding='utf-8') as f:
          json.dump(data, f)

      # process data
      data['title'] = clean_text(data['title'], args.stem)
      data['description'] = [clean_text(x, args.stem) for x in data['description']]

      # write cleaned file
      with open(f'{OUT_DIR_CLEANED}/{file}', 'w', encoding='utf-8') as f:
        json.dump(data, f)