#!/usr/bin/python
from os import listdir, remove
from os.path import isfile, join
from flask import *
from flask_cors import CORS
# import log_analysis.py
import numpy as np
import pandas as pd

app = Flask(__name__)


def find_shot_df(rdata):
	game_indices = set(shot_df.index[df['GAME_ID'] == rdata['gameID']].tolist())
	time_indices = set(shot_df.index[df['GAME_CLOCK'] == rdata['time']].tolist())
	quarter_indices = set(shot_df.index[df['PERIOD'] == rdata['quarter']].tolist())
	index = list(game_indices & time_indices & quarter_indices)[0]

	# get the data needed for expected shot value

	return {'playerID': shot_df[index, 5], 'pts_type': shot_df[index, 17],
		'fgm': shot_df[index, 18], 'fga': shot_df[index, 19], 'pts': shot_df[index, 20], 'dribbles': shot_df[index, 11]}

def find_possess_df(rdata):
	game_indices = set(possess_df.index[df['GAME_ID'] == rdata['gameID']].tolist())
	time_indices = set(possess_df.index[df['GAME_CLOCK']/10 == rdata['time']].tolist())
	quarter_indices = set(possess_df.index[df['PERIOD'] == rdata['quarter']].tolist())
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
	print(rdata)

def startup():
	shotFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_shot_log.csv"
	shot_df = pd.read_csv(shotFile)

	possessFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_possession_log.csv"
	possess_df = pd.read_csv(possessFile)

	passFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_pass_log.csv"
	pass_df = pd.read_csv(passFile)

	svFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_sv_box_scores.csv"
	sv_df = pd.read_csv(svFile)

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

	shot_df = shot_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])
	possess_df = possess_df.sort_values(['GAME_ID', 'GAME_CLOCK_START'], ascending=[True, True])
	pass_df = pass_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])
	sv_df = sv_df.sort_values(['GAME_ID'], ascending=[True])


if __name__ == '__main__':
	startup()
	app.run(host='localhost')