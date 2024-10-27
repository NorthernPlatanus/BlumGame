# BlumGame
Blum Game Clicker based on POST requests

## Adding your data
To configure this program, you need to add telegram data of your account to the `.env` file:
- **PHONE_NUMBER** of your telegram account
- **API_ID** and **API_HASH**, which you can get from [my.telegram.org/apps](https://my.telegram.org/apps). For detailed instructions, check this [YT tutorial](https://www.youtube.com/watch?v=8naENmP3rg4).
- **MIN_POINTS** and **MAX_POINTS** – These settings control the number of tokens you receive from each mini game. I highly dont recommend to set a very high maximum value. For safer settings, you can decrease lower and higher border of points.

## Installation and usage
You need to have node.js and npm installed. You can install npm right with the node.js installer. After installing node.js, download the source code:

1. **On Windows**: Click the green "Code" button in the top right corner, then select "Download ZIP".
2. **On Linux**: You can download the source code with this command:  
   ```wget https://github.com/NorthernPlatanus/BlumGame.git```

After downloading, unpack the archive and go to the program directory. Run the following command:  
```npm install```

After the dependencies are installed, start the program with:  
```node main.js```


Follow the instructions displayed in the console. The program will automatically exit when all games have been farmed, or you can manually exit by pressing `CTRL + C`.
