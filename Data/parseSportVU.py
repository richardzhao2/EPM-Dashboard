import xml.etree.ElementTree as xmlParser

e = xmlParser.parse('Files/Sample NBA raw tracking data/NBA_LG_FINAL_SEQUENCE_OPTICAL$2016102505_Q1.xml')

root = e.getroot()

boxscores = root[0][4][0][12]

# where moments start
moment = boxscores[0]

mC = 0 # number of moments
for x in boxscores.iter('moment'):
  print(x.attrib)
  mC += 1

print(mC)
