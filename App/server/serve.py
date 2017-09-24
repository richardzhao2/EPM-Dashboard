#!/usr/bin/python
from os import listdir, remove
from os.path import isfile, join
from flask import *
from flask_cors import CORS
# import log_analysis.py
import numpy as np
import pandas as pd
from effective_playmaking import calcEPM

import pickle

fileName = 'shotModel.sav'
loaded_model = pickle.load(open(fileName, 'rb'))

app = Flask(__name__)

global shot_df

dir = ''

names = {
  3704: 'LeBron James',
	3835: 'JR Smith',
	4391: 'Kevin Love',
	4840: 'Kyrie Irving',
	4884: 'Tristan Thompson',
	3706: 'Carmelo Anthony',
	4287: 'Joakim Noah',
	4484: 'Courtney Lee',
	4645: 'Derrick Rose',
	5464: 'Kristaps Porzingis',
}

def find_shot_df(rdata):
	game_indices = set(shot_df.index[shot_df['SV_GAME_ID'] == rdata['gameID']].tolist())
	time_indices = set(shot_df.index[abs((shot_df['GAME_CLOCK'] /10) - int(float(rdata['time']))) < 5].tolist())
	quarter_indices = set(shot_df.index[shot_df['PERIOD'] == rdata['quarter']].tolist())
	print(len(game_indices))
	print(len(time_indices))
	print(len(quarter_indices))
	common = game_indices & time_indices & quarter_indices
	if (len(common) < 1):
		print('no entry found')
		return

	index = list(game_indices & time_indices & quarter_indices)

	print(index)

	index = index[0]

	# print('ASDFLAKSDKJFLASDJFALSDKFJASLDKFJASLDKDFJAS')
	row = shot_df.iloc[index]

	# get the data needed for expected shot value

	player = row['SV_PLAYER_ID']

	if (player not in names.keys()):
		name = 'nobody'
		print('not famous', player)
	else:
		name = names[player]
  
	rawDict = {'playerID': name, 'pts_type': str(row['PTS_TYPE']), 'fgm': str(row['FGM']), 'fga': str(row['FGA']), 'pts': str(row['PTS']), 'dribbles': str(row['DRIBBLES']), 'teamID': str(row['SV_TEAM_ID'])}

	assists = 1
	
	rawDict['EPM'] = str(calcEPM(row['DRIBBLES'], loaded_model, row['SHOT_DIST'],row['CLOSE_DEF_DIST'],row['PTS_TYPE'],assists,row["TOUCH_TIME"])[0])

	return rawDict

def find_possess_df(rdata):
	game_indices = set(possess_df.index[possess_df['GAME_ID'] == rdata['gameID']].tolist())
	time_indices = set(possess_df.index[possess_df['GAME_CLOCK']/10 == rdata['time']].tolist())
	quarter_indices = set(possess_df.index[possess_df['PERIOD'] == rdata['quarter']].tolist())
	index = list(game_indices & time_indices & quarter_indices)[0]

	touches = possess_df[index, 11]
	return touches

CORS(app)

@app.route("/")
def index1():
	print('hello')

@app.route('/data', methods=['POST'])
def index():
	rdata = request.get_json() # { gameID: 3843, time: 3839, quarter: 29823434} 
	print('received request', rdata)
	return jsonify(find_shot_df(rdata))

def startup():
	global shot_df
	shotFile = dir + "game.csv"
	shot_df = pd.read_csv(shotFile)

	# print(shot_df.head())
	print(shot_df.dtypes)
	shot_df = shot_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])

if __name__ == '__main__':
	startup()
	app.run(host='localhost')
