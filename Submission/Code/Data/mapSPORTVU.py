import xml.etree.ElementTree as xmlParser
from os import listdir
from os.path import isfile, join
import json
import pickle
import re

dataDir = 'Files/Tracking Files/'
saveDir = 'SPORTVU UTIL/'

GAMES = {} # dict of dict

def parseXML(fileName):
  e = xmlParser.parse(dataDir + fileName)

  # game id from file
  id = re.findall(r'\$\d+_', fileName)[0][1:-1]

  GAMES[id] = {}

  root = e.getroot()

  date = root[0][4][0][1]

  GAMES[id]['date'] = {
    'month': date.attrib['month'],
    'day': date.attrib['date'],
    'year': date.attrib['year']
  }

  venue = root[0][4][0][7]

  GAMES[id]['venue'] = {
    'name': venue.attrib['name'],
    'city': venue.attrib['city']
  }

  away = root[0][4][0][10]

  awayName = away[0]
  awayCity = away[1]

  GAMES[id]['away'] = {
    'name': awayName.attrib['name'],
    'city': awayCity.attrib['city']
  }

  home = root[0][4][0][11]

  homeName = home[0]
  homeCity = home[1]

  GAMES[id]['home'] = {
    'name': homeName.attrib['name'],
    'city': homeCity.attrib['city']
  }


if __name__== '__main__':
  # all the XML files in the SPORTVU data set
  fileNames = [f for f in listdir(dataDir) if isfile(join(dataDir, f))]
  for x in range(700): #len(fileNames)):
    parseXML(fileNames[x])

  pickle.dump(GAMES, open(saveDir + 'SVGames' +'.p', 'wb'))
