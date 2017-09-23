#!/usr/bin/python
from os import listdir, remove
from os.path import isfile, join
from flask import *
from flask_cors import CORS
app = Flask(__name__)

CORS(app)

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/data', methods=['POST'])
def index():
  rdata = request.get_json()
  
  print(rdata)

  return jsonify(rdata)

if __name__ == '__main__':
  app.run(host='localhost')