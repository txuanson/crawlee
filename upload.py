import boto3
import os
import argparse
from tqdm import tqdm

# s3 client for cloudflare r2
s3 = boto3.client(
  service_name = 's3',
  endpoint_url = '<endpoint>',
  aws_access_key_id = '<access_key>',
  aws_secret_access_key = '<secret_key>',
  region_name= 'apac'
)

# argparse
parser = argparse.ArgumentParser()
parser.add_argument('-d', '--data', type=str, default='storage/datasets/default', help='Path to data directory')
parser.add_argument('-p', '--prefix', type=str, default='output', help='Key prefix')
parser.add_argument('-b', '--bucket', type=str, default='storage', help='Bucket name')
args = parser.parse_args()

# list all files in directory
files = os.listdir(args.data)

for file in tqdm(files):
  # check if file is json
  if file.endswith('.json'):
    s3.upload_file(f'{args.data}/{file}', args.bucket, f'{args.prefix}/{file}')
