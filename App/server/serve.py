#!/usr/bin/python
from os import listdir, remove
from os.path import isfile, join
from flask import *
from flask_cors import CORS
# import log_analysis.py
import numpy as np
import pandas as pd

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

	return {'playerID': name, 'pts_type': str(row['PTS_TYPE']),
		'fgm': str(row['FGM']), 'fga': str(row['FGA']), 'pts': str(row['PTS']), 'dribbles': str(row['DRIBBLES'])}

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

	"""
	possessFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_possession_log.csv"
	possess_df = pd.read_csv(possessFile)

	passFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_pass_log.csv"
	pass_df = pd.read_csv(passFile)

	svFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_sv_box_scores.csv"
	sv_df = pd.read_csv(svFile)
	"""

	"""
	print("Shot Log:")
	for i in range(len(list(shot_df))):
		head = list(shot_df)[i]
		if i == 0:
			shot_df.rename(columns={head: 'GAME_ID'}, inplace=True)

	print("Possession Log:")
	for j in range(len(list(possess_df))):
		head = list(possess_df)[j]
		if j == 0:
			possess_df.rename(columns={head: 'GAME_ID'}, inplace=True)

	print("Pass Log:")
	for k in range(len(list(pass_df))):
		head = list(pass_df)[k]
		if k == 0:
			 pass_df.rename(columns={head: 'GAME_ID'}, inplace=True)

	print("SportVU Log:")
	for l in range(len(list(sv_df))):
		head = list(sv_df)[l]
		if l == 0:
			sv_df.rename(columns={head: 'GAME_ID'}, inplace=True)
	"""

	# print(shot_df.head())
	print(shot_df.dtypes)
	shot_df = shot_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])

	"""
	possess_df = possess_df.sort_values(['GAME_ID', 'GAME_CLOCK_START'], ascending=[True, True])
	pass_df = pass_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])
	sv_df = sv_df.sort_values(['GAME_ID'], ascending=[True])
	"""

if __name__ == '__main__':
	startup()
	app.run(host='localhost')
