import xml.etree.ElementTree as xmlParser
from os import listdir
from os.path import isfile, join
import json
import pickle

dataDir = 'Files/Tracking Files/'
SVDir = 'SPORTVU PY/'

def parseXML(fileName):
  e = xmlParser.parse(dataDir + fileName)

  root = e.getroot()

  boxscores = root[0][4][0][12]

  # where moments start
  moment = boxscores[0]

  combined = []
  for x in boxscores.iter('moment'):
    combined.append(x.attrib)

  pickle.dump(combined, open('SPORTVU PY/' + fileName[:-4] +'.p', 'wb'))

def convertJSON(fileName):
  obj = pickle.load(open('SPORTVU PY/' + fileName + '.p', 'rb'))

  tempFile = open('SPORTVU JSON/' + fileName + '.json', 'w')
  tempFile.write(json.dumps(obj))
  tempFile.close()



if __name__== '__main__':
  # all the XML files in the SPORTVU data set
  fileNames = [f for f in listdir(dataDir) if isfile(join(dataDir, f))]
  SVNames = [f for f in listdir(SVDir) if isfile(join(SVDir, f))]
  #for x in range(len(fileNames)):
    #parseXML(fileNames[x])
  for x in range(len(SVNames)):
    convertJSON(SVNames[x][:-2])
