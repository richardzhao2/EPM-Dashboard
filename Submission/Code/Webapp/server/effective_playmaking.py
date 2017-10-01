import numpy as np
import pickle

fileName = 'shotModel.sav'
loaded_model = pickle.load(open(fileName, 'rb'))

def calcEPM(dribbles, model, shot_dist, def_dist, pts_type, assists, touches):

    logisticFunc = (1 / (1 + np.exp(dribbles-4))) - 0.5

    regressModel = model
    expValue = regressModel.predict([[shot_dist, touches, def_dist, pts_type]])

    try:
        APT = (assists / touches) * 4
    except:
        APT = (assists / (touches + 1)) * 4

    return logisticFunc + expValue + APT






