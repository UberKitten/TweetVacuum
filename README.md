![TweetVacuum logo](https://github.com/T3hUb3rK1tten/TweetVacuum/raw/master/logo_128.png)
# TweetVacuum
Chrome extension to scrape a user's entire timeline, bypassing the Twitter API 3200 tweet limit.

## Usage

Usage is simple. Click the icon in the top right of Chrome. Type in the username of the account you're using and click start.

A new window will open up and start searching for tweets by that user. As the script runs, it will save the tweets and remove them from the search page. The search page starts to slow down significantly after ~1000 tweets, so the script will restart the tab and keep going where it left off.

When it reaches the end of the timeline, make sure to stop the script. Currently it can't detect the difference between no more results and a crashed tab.

The script will resume from where it left off if stopped.

## Installation

### Chrome Web Store
The extension is published on the Chrome Web Store but unlisted. You can download it [here](https://chrome.google.com/webstore/detail/tweetvacuum/ieanpikkfcbeakclfkoeccpdcmfapjfl).

### Manually
1. Clone this repo or download it as a ZIP and extract it
2. Open the Chrome Extensions page
3. Check "Developer mode"
4. Click "Load unpacked extension..." and select the folder for the repo
