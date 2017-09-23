import xml.etree.ElementTree as xmlParser
from os import listdir
from os.path import isfile, join
import pickle

dataDir = 'Files/Sample NBA raw tracking data/'

def parseXML(fileName):
  e = xmlParser.parse(dataDir + fileName)

  root = e.getroot()

  boxscores = root[0][4][0][12]

  # where moments start
  moment = boxscores[0]

  combined = []
  for x in boxscores.iter('moment'):
    combined.append(x.attrib)

  pickle.dump(combined, open('SPORTVU/' + fileName[:-4] +'.p', 'wb'))

def 

if __name__== '__main__':
  # all the XML files in the SPORTVU data set
  fileNames = [f for f in listdir(dataDir) if isfile(join(dataDir, f))]
  for x in range(len(fileNames)):
    parseXML(fileNames[x])
