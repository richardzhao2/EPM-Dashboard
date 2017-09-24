import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor

print("Loading in Data...")

shotFile1 = "Basketball Data/NBAPlayerTrackingData_2014-17/2015-16_nba_shot_log.csv"
shot1_df = pd.read_csv(shotFile1)

shotFile2 = "Basketball Data/NBAPlayerTrackingData_2014-17/2016-17_nba_shot_log.csv"
shot2_df = pd.read_csv(shotFile2)

shot_df = pd.concat([shot1_df, shot2_df])

print("Done!")

def expValRegressor(shot_df):

    # define learning algorithm inputs and outputs
    X = shot_df[['SHOT_DIST', 'TOUCH_TIME', 'CLOSE_DEF_DIST', 'PTS_TYPE']]
    Y = shot_df["PTS"]

    print("Prepare Data for Learning...")
    print()

    print("Vector Dimensions:")
    print("X:", X.shape)
    print("Y:", Y.shape)
    print()

    """
    # normalize data
    for column in list(X):
        values = X[column]
        mean = np.mean(values)
        std = np.std(values)
        X[column] = (X[column] - mean) / std
    """

    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.33, random_state=42)

    print("Done!")

    print("Machine Learning Underway...")
    print()

    bestScore = 0
    bestModel = None
    NNInfra = (8, 11)

    print("Grid Searching for Optimal # of Layers / Units...")
    for layers in range(1, 4):
        for units in range(1, 4):
            model = MLPRegressor(hidden_layer_sizes=(layers, units), alpha=0.001, random_state=20,
                                  batch_size='auto', learning_rate='constant', learning_rate_init=0.01)
            model.fit(X_train, y_train)
            currentScore = model.score(X_test, y_test)
            print(str(layers) + " layers & " + str(units) + " units yields error =", str(currentScore))
            if currentScore < bestScore:
                bestScore = currentScore
                bestModel = model
                NNInfra = (layers, units)

    bestModel = MLPRegressor(hidden_layer_sizes=NNInfra, alpha=0.001, random_state=20,
                         batch_size='auto', learning_rate='constant', learning_rate_init=0.01)
    bestModel.fit(X_train, y_train)
    predicted_Y = bestModel.predict(X)

    print("Error =", bestModel.score(X_test, y_test))
    print()

    print("Done!")
    print()

    return bestModel

# Feature Sequence: ['SHOT_DIST', 'TOUCH_TIME', 'CLOSE_DEF_DIST', 'PTS_TYPE']
# bestModel.predict([[20, 10, 10, 2]])

import pickle

neuralModel = expValRegressor(shot_df)
fileName = 'shotModel.sav'
pickle.dump(neuralModel, open(fileName, 'wb'))
