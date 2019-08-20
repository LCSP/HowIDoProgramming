#! python3
import pyautogui
from PIL import ImageGrab
import time

def getPixelColor():
    image = ImageGrab.grab(bbox=(327,141,970,245))
    color = image.getpixel((160,75)) #has to be 83
    if color[1] == 83:
        return True
    else:
        return False



    


while True:
    try:
        if getPixelColor() != False:
            print('Obstaculo!')
            #time.sleep(0.5)
            pyautogui.press('space')
    except KeyboardInterrupt:
        print('Manual break by user')
        break










