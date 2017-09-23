
import numpy as np
import pandas as pd
import time

startTime = time.time()

dir = "Data/Files/"

fileName dir = dir + "Play_by_Play_New.csv"
df = pd.read_csv(fileName)

playerMatch = "Basketball Data/Player_Map.csv"
player_df = pd.read_csv(playerMatch)

teamMatch = "Basketball Data/Team_Map.csv"
player_df = pd.read_csv(teamMatch)

startIndex = np.where(df["Season"] == 2016)[0][0]

print("Headers:")
for header in df:
    print(header)
    df[header] = df[header][startIndex:]
print()

endTime = time.time()
print("Time Elapsed:", endTime - startTime, "sec")