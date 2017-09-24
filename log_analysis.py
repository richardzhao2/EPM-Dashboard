import numpy as np
import pandas as pd

print("Loading in Data...")

shotFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_shot_log.csv"
shot_df = pd.read_csv(shotFile)

possessFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_possession_log.csv"
possess_df = pd.read_csv(possessFile)

passFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_pass_log.csv"
pass_df = pd.read_csv(passFile)

svFile = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_sv_box_scores.csv"
sv_df = pd.read_csv(svFile)

assistFile = "Basketball Data/NBAPlayerTrackingData_2014-17/assist_data_cavs_knicks.csv"
assist_df = pd.read_csv(assistFile)

print("Done!")

print("Compiling Headers...")
print()

print("Shot Log:")
for i in range(len(list(shot_df))):
    head = list(shot_df)[i]
    if i == 0:
        shot_df.rename(columns={head: 'GAME_ID'}, inplace=True)
    print(head)
print()

print("Possession Log:")
for j in range(len(list(possess_df))):
    head = list(possess_df)[j]
    if j == 0:
        possess_df.rename(columns={head: 'GAME_ID'}, inplace=True)
    print(head)
print()

print("Pass Log:")
for k in range(len(list(pass_df))):
    head = list(pass_df)[k]
    if k == 0:
        pass_df.rename(columns={head: 'GAME_ID'}, inplace=True)
    print(head)
print()

print("SportVU Log:")
for l in range(len(list(sv_df))):
    head = list(sv_df)[l]
    if l == 0:
        sv_df.rename(columns={head: 'GAME_ID'}, inplace=True)
    print(head)
print()

print("Done!")

shot_df = shot_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])
possess_df = possess_df.sort_values(['GAME_ID', 'GAME_CLOCK_START'], ascending=[True, True])
pass_df = pass_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])
sv_df = sv_df.sort_values(['GAME_ID'], ascending=[True])

print(possess_df.shape)
print(pass_df.shape)
print(sv_df.shape)
