from PIL import ImageGrab

image = ImageGrab.grab()
    
color = image.getpixel((423,230))
print(color[1])