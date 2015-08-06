var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require("ipc-promise");
var flumine = require("flumine");
var airbnb = require("./airbnb");
var Promise = require("bluebird");
require('electron-debug')();
require('crash-reporter').start();

var mainWindow = null;

ipc.on("estimate", airbnb.estimateRate);

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {

    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        title: "airbnbEstimator"
    });
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
// メニュー情報の作成
var template = [{
    label: 'airbnbEstimator',
    submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
            app.quit();
        }
    }]
}, {
    label: 'Debug',
    submenu: [{
        label: 'Reload',
        accelerator: 'Command+R',
        click: function() {
            BrowserWindow.getFocusedWindow().reloadIgnoringCache();
        }
    }, {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function() {
            BrowserWindow.getFocusedWindow().toggleDevTools();
        }
    }]
}];

var menu = require("menu").buildFromTemplate(template);
